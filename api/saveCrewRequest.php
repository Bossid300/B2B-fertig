<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

session_start();

$actorProfileId = $_SESSION['profile_id'] ?? null;

if (!$actorProfileId) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'error' => 'Nicht angemeldet'
    ]);

    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input) || empty($input['requestId'])) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'requestId fehlt'
    ]);

    exit;
}

$requestType = $input['requestType'] ?? $input['source'] ?? 'crew_request';
$source = $input['source'] ?? null;
$inReplyToRequestId = $input['inReplyToRequestId'] ?? null;
$isCounterOffer =
    $requestType === 'counter'
    || $source === 'counter_offer'
    || !empty($inReplyToRequestId);

if (
    !is_string($requestType)
    || ($source !== null && !is_string($source))
    || (!is_string($input['requestId']) && !is_int($input['requestId']))
    || ($isCounterOffer && (
        (!is_string($inReplyToRequestId) && !is_int($inReplyToRequestId))
        || (string) $inReplyToRequestId === ''
    ))
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Ungültige Request-Daten'
    ]);

    exit;
}

try {
    $requestId = (string) $input['requestId'];
    $requestData = $input;
    $now = round(microtime(true) * 1000);
    $parent = null;
    $parentJson = [];

    $pdo->beginTransaction();

    if ($isCounterOffer) {
        $stmt = $pdo->prepare("
            SELECT
                id,
                requester_profile_id,
                requested_profile_id,
                event_id,
                status,
                request_json
            FROM requests
            WHERE id = :id
            LIMIT 1
            FOR UPDATE
        ");
        $stmt->execute([
            ':id' => $inReplyToRequestId
        ]);
        $parent = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$parent) {
            $pdo->rollBack();
            http_response_code(404);

            echo json_encode([
                'success' => false,
                'error' => 'Ursprünglicher Request nicht gefunden'
            ]);

            exit;
        }

        if ((string) $parent['requested_profile_id'] !== (string) $actorProfileId) {
            $pdo->rollBack();
            http_response_code(403);

            echo json_encode([
                'success' => false,
                'error' => 'Keine Berechtigung für diesen Request'
            ]);

            exit;
        }

        if ($parent['status'] !== 'pending') {
            $pdo->rollBack();
            http_response_code(409);

            echo json_encode([
                'success' => false,
                'error' => 'Der ursprüngliche Request ist nicht mehr offen'
            ]);

            exit;
        }

        if (empty($parent['requester_profile_id'])) {
            $pdo->rollBack();
            http_response_code(409);

            echo json_encode([
                'success' => false,
                'error' => 'Ursprünglicher Request hat keinen gültigen Requester'
            ]);

            exit;
        }

        if (!empty($parent['request_json'])) {
            $decodedParent = json_decode($parent['request_json'], true);
            if (is_array($decodedParent)) {
                $parentJson = $decodedParent;
            }
        }

        $requestType = 'counter';
        $source = 'counter_offer';
        $requestData['inReplyToRequestId'] = $parent['id'];
        $requestData['requestedProfileId'] = $parent['requester_profile_id'];
        $requestData['eventId'] = $parent['event_id'] ?? $parentJson['eventId'] ?? null;

        foreach (['eventName', 'date'] as $field) {
            if (array_key_exists($field, $parentJson)) {
                $requestData[$field] = $parentJson[$field];
            } else {
                unset($requestData[$field]);
            }
        }
    } else {
        $requestedProfileId = $input['requestedProfileId'] ?? null;
        if (
            (!is_string($requestedProfileId) && !is_int($requestedProfileId))
            || (string) $requestedProfileId === ''
        ) {
            $pdo->rollBack();
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'error' => 'requestedProfileId fehlt'
            ]);

            exit;
        }
    }

    $requestData['requestId'] = $requestId;
    $requestData['requestType'] = $requestType;
    if ($source !== null) {
        $requestData['source'] = $source;
    }
    $requestData['requesterProfileId'] = $actorProfileId;
    $requestData['status'] = 'pending';
    $requestData['updatedAt'] = $now;

    $eventId = $requestData['eventId'] ?? null;
    $requestedProfileId = $requestData['requestedProfileId'];
    $note = $requestData['note'] ?? null;
    $requestJson = json_encode($requestData, JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("
        INSERT INTO requests (
            id,
            request_type,
            event_id,
            requester_profile_id,
            requested_profile_id,
            status,
            note,
            request_json,
            updated_at
        ) VALUES (
            :id,
            :request_type,
            :event_id,
            :requester_profile_id,
            :requested_profile_id,
            :status,
            :note,
            :request_json,
            :updated_at
        )
    ");

    $stmt->execute([
        ':id' => $requestId,
        ':request_type' => $requestType,
        ':event_id' => $eventId,
        ':requester_profile_id' => $actorProfileId,
        ':requested_profile_id' => $requestedProfileId,
        ':status' => 'pending',
        ':note' => $note,
        ':request_json' => $requestJson,
        ':updated_at' => $now
    ]);

    if ($isCounterOffer) {
        $parentJson['requestId'] = $parent['id'];
        $parentJson['status'] = 'counter_offer';
        $parentJson['updatedAt'] = $now;

        $stmt = $pdo->prepare("
            UPDATE requests
            SET
                status = 'counter_offer',
                request_json = :request_json,
                updated_at = :updated_at
            WHERE id = :id
              AND status = 'pending'
              AND requested_profile_id = :actor_profile_id
        ");
        $stmt->execute([
            ':request_json' => json_encode($parentJson, JSON_UNESCAPED_UNICODE),
            ':updated_at' => $now,
            ':id' => $parent['id'],
            ':actor_profile_id' => $actorProfileId
        ]);

        if ($stmt->rowCount() !== 1) {
            throw new RuntimeException('Ursprünglicher Request konnte nicht abgeschlossen werden');
        }
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'requestId' => $requestId
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}