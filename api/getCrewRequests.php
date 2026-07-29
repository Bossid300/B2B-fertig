<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("
        SELECT *
        FROM requests
        ORDER BY created_at DESC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $requests = [];

    foreach ($rows as $row) {
        $json = [];

        if (!empty($row['request_json'])) {
            $decoded = json_decode($row['request_json'], true);
            if (is_array($decoded)) {
                $json = $decoded;
            }
        }

        $requests[] = array_merge($json, [
            'requestId' => $json['requestId'] ?? $row['id'],
            'requestType' => $json['requestType'] ?? $row['request_type'],
            'eventId' => $json['eventId'] ?? $row['event_id'],
            'requesterProfileId' => $json['requesterProfileId'] ?? $row['requester_profile_id'],
            'requestedProfileId' => $json['requestedProfileId'] ?? $row['requested_profile_id'],
            'status' => $json['status'] ?? $row['status'],
            'note' => $json['note'] ?? $row['note'],
            'updatedAt' => $json['updatedAt'] ?? $row['updated_at']
        ]);
    }

    echo json_encode([
        'success' => true,
        'requests' => $requests
    ]);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}