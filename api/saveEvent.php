<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

session_start();

$actorProfileId =
    $_SESSION['profile_id']
    ?? null;

$actorAuthUserId =
    $_SESSION['auth_user_id']
    ?? null;

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['id'])) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Event-ID fehlt'
    ]);

    exit;
}

try {
    $eventId = $input['id'];

    $ownerId =
        $input['ownerId']
        ?? $input['owner_id']
        ?? null;

    $title =
        $input['title']
        ?? $input['name']
        ?? 'Unbenanntes Event';

    $venue =
        $input['venue']
        ?? $input['location']
        ?? null;

    $eventDate =
    array_key_exists('event_date', $input)
        ? $input['event_date']
        : ($input['date'] ?? null);

    $eventType =
        $input['type']
        ?? $input['event_type']
        ?? null;

    $updatedAt =
        $input['updatedAt']
        ?? round(microtime(true) * 1000);

    $stmt = $pdo->prepare("
        INSERT INTO events (
            id,
            owner_id,
            title,
            venue,
            event_date,
            event_type,
            event_json,
            updated_at
        ) VALUES (
            :id,
            :owner_id,
            :title,
            :venue,
            :event_date,
            :event_type,
            :event_json,
            :updated_at
        )
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            venue = VALUES(venue),
            event_date = VALUES(event_date),
            event_type = VALUES(event_type),
            event_json = VALUES(event_json),
            updated_at = VALUES(updated_at)
    ");

    $pdo->beginTransaction();

    $existingStmt = $pdo->prepare("
        SELECT owner_id, venue, event_json
        FROM events
        WHERE id = :id
        LIMIT 1
        FOR UPDATE
    ");
    $existingStmt->execute([
        ':id' => $eventId
    ]);
    $existingEvent = $existingStmt->fetch(PDO::FETCH_ASSOC);

    $isOwner = $actorProfileId !== null
        && $existingEvent
        && (string)$existingEvent['owner_id'] === (string)$actorProfileId;

    if ($existingEvent && !$isOwner) {
        $storedEventData = json_decode(
            $existingEvent['event_json'] ?? '',
            true
        );
        if (!is_array($storedEventData)) {
            $storedEventData = [];
        }

        foreach ([
            'crewIds',
            'promotionData',
            'venueName',
            'street',
            'zip',
            'city',
            'timeline',
            'productionNotes',
            'plannerLocked'
        ] as $field) {
            if (array_key_exists($field, $storedEventData)) {
                $input[$field] = $storedEventData[$field];
            } else {
                unset($input[$field]);
            }
        }

        $storedLogistics = is_array($storedEventData['logistics'] ?? null)
            ? $storedEventData['logistics']
            : [];
        $inputLogistics = is_array($input['logistics'] ?? null)
            ? $input['logistics']
            : [];

        foreach (['setup', 'power', 'catering', 'security'] as $field) {
            if (array_key_exists($field, $storedLogistics)) {
                $inputLogistics[$field] = $storedLogistics[$field];
            } else {
                unset($inputLogistics[$field]);
            }
        }

        if (array_key_exists('logistics', $input) || $inputLogistics) {
            $input['logistics'] = $inputLogistics;
        }

        $venue = $existingEvent['venue'];
        $input['venue'] = $venue;
    }

    $eventJson = json_encode($input, JSON_UNESCAPED_UNICODE);

    $stmt->execute([
        ':id' => $eventId,
        ':owner_id' => $ownerId,
        ':title' => $title,
        ':venue' => $venue,
        ':event_date' => $eventDate,
        ':event_type' => $eventType,
        ':event_json' => $eventJson,
        ':updated_at' => $updatedAt
    ]);

    $stmt = $pdo->prepare("
        SELECT owner_id
        FROM events
        WHERE id = :id
    ");
    $stmt->execute([
        ':id' => $eventId
    ]);
    $storedOwnerId = $stmt->fetchColumn();

    if ($storedOwnerId === false) {
        throw new RuntimeException('Gespeichertes Event nicht gefunden');
    }

    $input['ownerId'] = $storedOwnerId;
    $input['owner_id'] = $storedOwnerId;
    $eventJson = json_encode($input, JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("
        UPDATE events
        SET event_json = :event_json
        WHERE id = :id
    ");
    $stmt->execute([
        ':event_json' => $eventJson,
        ':id' => $eventId
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'eventId' => $eventId,
        'session_detected' => !empty($actorProfileId)
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