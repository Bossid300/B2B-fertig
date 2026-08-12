<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['requestId'])) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'requestId fehlt'
    ]);

    exit;
}

try {
    $requestId = $input['requestId'];

    $requestType =
        $input['requestType']
        ?? $input['source']
        ?? 'crew_request';

    $eventId =
        $input['eventId']
        ?? null;

    $requesterProfileId =
        $input['requesterProfileId']
        ?? null;

    $requestedProfileId =
        $input['requestedProfileId']
        ?? null;

    $status =
        $input['status']
        ?? 'pending';

    $note =
        $input['note']
        ?? null;

    $updatedAt =
        $input['updatedAt']
        ?? round(microtime(true) * 1000);

    $requestJson = json_encode($input, JSON_UNESCAPED_UNICODE);

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
        ON DUPLICATE KEY UPDATE
            request_type = VALUES(request_type),
            event_id = VALUES(event_id),
            requester_profile_id = VALUES(requester_profile_id),
            requested_profile_id = VALUES(requested_profile_id),
            status = VALUES(status),
            note = VALUES(note),
            request_json = VALUES(request_json),
            updated_at = VALUES(updated_at)
    ");

    $stmt->execute([
        ':id' => $requestId,
        ':request_type' => $requestType,
        ':event_id' => $eventId,
        ':requester_profile_id' => $requesterProfileId,
        ':requested_profile_id' => $requestedProfileId,
        ':status' => $status,
        ':note' => $note,
        ':request_json' => $requestJson,
        ':updated_at' => $updatedAt
    ]);

    echo json_encode([
        'success' => true,
        'requestId' => $requestId
    ]);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}