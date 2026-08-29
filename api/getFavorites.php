<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

try {

    $profileId =
        $_GET['profile_id'] ?? '';

    if (!$profileId) {
        throw new Exception(
            'profile_id fehlt'
        );
    }

    $stmt = $pdo->prepare("
        SELECT
            favorite_profile_id
        FROM favorites
        WHERE profile_id = :profile_id
        ORDER BY created_at DESC
    ");

    $stmt->execute([
        ':profile_id' => $profileId
    ]);

    $favorites =
        $stmt->fetchAll(
            PDO::FETCH_ASSOC
        );

    echo json_encode([
        'success' => true,
        'favorites' => $favorites
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}