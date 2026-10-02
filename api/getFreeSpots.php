<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

try {

    $sql = "
        SELECT
            id,
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
            status,
            created_at,
            updated_at
        FROM free_spots
        WHERE status = 'active'
        ORDER BY spot_date ASC, time_from ASC, id ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $freeSpots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'freeSpots' => $freeSpots
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'freeSpots' => [],
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}