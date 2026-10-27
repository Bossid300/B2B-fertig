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
        'error' => 'Nicht angemeldet'
    ]);

    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT *
        FROM requests
        WHERE requester_profile_id = :requester_profile_id
           OR requested_profile_id = :requested_profile_id
        ORDER BY created_at DESC
    ");
    $stmt->execute([
        ':requester_profile_id' => $profileId,
        ':requested_profile_id' => $profileId
    ]);

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