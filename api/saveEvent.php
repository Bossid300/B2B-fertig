<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

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

    $eventJson = json_encode($input, JSON_UNESCAPED_UNICODE);

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
            owner_id = VALUES(owner_id),
            title = VALUES(title),
            venue = VALUES(venue),
            event_date = VALUES(event_date),
            event_type = VALUES(event_type),
            event_json = VALUES(event_json),
            updated_at = VALUES(updated_at)
    ");

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

    echo json_encode([
        'success' => true,
        'eventId' => $eventId
    ]);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}