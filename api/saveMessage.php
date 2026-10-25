<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

session_start();

$profileId = $_SESSION['profile_id'] ?? null;
if (!$profileId) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Nicht authentifiziert'
    ]);
    exit;
}

$input = json_decode(
    file_get_contents('php://input'),
    true
);

if (!$input || empty($input['id'])) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Message-ID fehlt'
    ]);

    exit;
}

try {

    $id =
        $input['id'];

    $eventId =
        $input['eventId']
        ?? null;

    if ($eventId === null || $eventId === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Event-ID fehlt'
        ]);
        exit;
    }

    $eventStmt = $pdo->prepare("
        SELECT owner_id, event_json
        FROM events
        WHERE id = :event_id
        LIMIT 1
    ");
    $eventStmt->execute([
        ':event_id' => $eventId
    ]);
    $event = $eventStmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Event nicht gefunden'
        ]);
        exit;
    }

    $isOwner =
        (string)$event['owner_id'] === (string)$profileId;

    $eventData = json_decode(
        $event['event_json'] ?? '',
        true
    );
    $crewIds = is_array($eventData['crewIds'] ?? null)
        ? $eventData['crewIds']
        : [];

    $isCrewMember = in_array(
        (string)$profileId,
        array_map('strval', $crewIds),
        true
    );

    if (!$isOwner && !$isCrewMember) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Keine Berechtigung für dieses Event'
        ]);
        exit;
    }

    $senderProfileId = $profileId;

    $channel =
        $input['channel']
        ?? 'all';

    $messageText =
        $input['messageText']
        ?? '';

    $stmt = $pdo->prepare("
        INSERT INTO messages (
            id,
            event_id,
            sender_profile_id,
            channel,
            message_text
        ) VALUES (
            :id,
            :event_id,
            :sender_profile_id,
            :channel,
            :message_text
        )
        ON DUPLICATE KEY UPDATE
            event_id = VALUES(event_id),
            sender_profile_id = VALUES(sender_profile_id),
            channel = VALUES(channel),
            message_text = VALUES(message_text)
    ");

    $stmt->execute([
        ':id' => $id,
        ':event_id' => $eventId,
        ':sender_profile_id' => $senderProfileId,
        ':channel' => $channel,
        ':message_text' => $messageText
    ]);

    echo json_encode([
        'success' => true,
        'messageId' => $id
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}