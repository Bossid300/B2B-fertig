<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

try {

    $profileId = $_GET['profile_id'] ?? '';

    if (!$profileId) {
        throw new Exception('profile_id fehlt');
    }

    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM favorites
        WHERE favorite_profile_id = :profile_id
    ");

    $stmt->execute([
        ':profile_id' => $profileId
    ]);

    $count = (int) $stmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'count' => $count
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}