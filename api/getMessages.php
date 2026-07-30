<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

try {

    $eventId =
        $_GET['eventId']
        ?? '';

    $stmt = $pdo->prepare("
        SELECT
            id,
            event_id,
            sender_profile_id,
            channel,
            message_text,
            created_at
        FROM messages
        WHERE event_id = :event_id
        ORDER BY created_at ASC
    ");

    $stmt->execute([
        ':event_id' => $eventId
    ]);

    $messages =
        $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'messages' => $messages
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}