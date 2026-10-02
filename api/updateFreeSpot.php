<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$data = json_decode(
    file_get_contents('php://input'),
    true
);

if (!$data) {
    echo json_encode([
        'success' => false,
        'error' => 'Keine Daten erhalten'
    ]);
    exit;
}

$id          = (int)($data['id'] ?? 0);
$ownerId     = trim($data['owner_id'] ?? '');
$title       = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$spotDate    = trim($data['spot_date'] ?? '');
$timeFrom    = !empty($data['time_from']) ? $data['time_from'] : null;
$timeTo      = !empty($data['time_to']) ? $data['time_to'] : null;
$location    = trim($data['location'] ?? '');
$city        = trim($data['city'] ?? '');
$region      = trim($data['region'] ?? '');
$category    = trim($data['category'] ?? '');

if (!$id || !$ownerId || !$title || !$spotDate) {
    echo json_encode([
        'success' => false,
        'error' => 'id, owner_id, title und spot_date sind erforderlich'
    ]);
    exit;
}

try {

    $sql = "
        UPDATE free_spots
        SET
            title = :title,
            description = :description,
            spot_date = :spot_date,
            time_from = :time_from,
            time_to = :time_to,
            location = :location,
            city = :city,
            region = :region,
            category = :category,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
          AND owner_id = :owner_id
          AND status = 'active'
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $id,
        ':owner_id' => $ownerId,
        ':title' => $title,
        ':description' => $description ?: null,
        ':spot_date' => $spotDate,
        ':time_from' => $timeFrom,
        ':time_to' => $timeTo,
        ':location' => $location ?: null,
        ':city' => $city ?: null,
        ':region' => $region ?: null,
        ':category' => $category ?: null
    ]);

    echo json_encode([
        'success' => true,
        'id' => $id
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}