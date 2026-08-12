<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

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

    $senderProfileId =
        $input['senderProfileId']
        ?? null;

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