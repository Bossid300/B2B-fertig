<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'error' => 'Keine Daten erhalten'
    ]);
    exit;
}

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

if (!$ownerId || !$title || !$spotDate) {
    echo json_encode([
        'success' => false,
        'error' => 'owner_id, title und spot_date sind erforderlich'
    ]);
    exit;
}

try {

    $sql = "
        INSERT INTO free_spots
        (
            owner_id,
            title,
            description,
            spot_date,
            time_from,
            time_to,
            location,
            city,
            region,
            category,
            status
        )
        VALUES
        (
            :owner_id,
            :title,
            :description,
            :spot_date,
            :time_from,
            :time_to,
            :location,
            :city,
            :region,
            :category,
            'active'
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':owner_id'     => $ownerId,
        ':title'        => $title,
        ':description'  => $description ?: null,
        ':spot_date'    => $spotDate,
        ':time_from'    => $timeFrom,
        ':time_to'      => $timeTo,
        ':location'     => $location ?: null,
        ':city'         => $city ?: null,
        ':region'       => $region ?: null,
        ':category'     => $category ?: null
    ]);

    echo json_encode([
        'success' => true,
        'id' => (int)$pdo->lastInsertId()
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}