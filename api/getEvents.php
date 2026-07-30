<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

try {

    $stmt = $pdo->query("
        SELECT *
        FROM events
        ORDER BY created_at DESC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $events = [];

    foreach ($rows as $row) {
        $jsonData = [];

        if (!empty($row['event_json'])) {
            $decoded = json_decode($row['event_json'], true);

            if (is_array($decoded)) {
                $jsonData = $decoded;
            }
        }

        $baseEvent = [
            'id' => $row['id'],
            'ownerId' => $row['owner_id'],
            'owner_id' => $row['owner_id'],
            'title' => $row['title'],
            'name' => $row['title'],
            'venue' => $row['venue'],
            'location' => $row['venue'],
            'date' => $row['event_date'],
            'event_date' => $row['event_date'],
            'type' => $row['event_type'],
            'event_type' => $row['event_type'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];

        $event = array_merge(
            $baseEvent,
            $jsonData
        );

        // Sicherheits-Fallbacks für alte Events ohne event_json
        if (!isset($event['crew'])) {
            $event['crew'] = [];
        }

        if (!isset($event['crewIds'])) {
            $event['crewIds'] = !empty($event['ownerId'])
                ? [$event['ownerId']]
                : [];
        }

        if (!isset($event['acceptedDeals'])) {
            $event['acceptedDeals'] = new stdClass();
        }

        if (!isset($event['riderCenter'])) {
            $event['riderCenter'] = new stdClass();
        }

        if (!isset($event['promotionData'])) {
            $event['promotionData'] = new stdClass();
        }

        if (!isset($event['plannerLocked'])) {
            $event['plannerLocked'] = false;
        }

        if (!isset($event['dealSent'])) {
            $event['dealSent'] = false;
        }

        $events[] = $event;
    }

    echo json_encode([
        "success" => true,
        "events" => $events
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
