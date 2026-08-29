<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!$data) {
        throw new Exception('Keine Daten erhalten');
    }

    $profileId =
        $data['profile_id'] ?? '';

    $favoriteProfileId =
        $data['favorite_profile_id'] ?? '';

    if (
        !$profileId ||
        !$favoriteProfileId
    ) {
        throw new Exception(
            'profile_id oder favorite_profile_id fehlt'
        );
    }

    $stmt = $pdo->prepare("
        INSERT INTO favorites
        (
            profile_id,
            favorite_profile_id
        )
        VALUES
        (
            :profile_id,
            :favorite_profile_id
        )
    ");

    $stmt->execute([
        ':profile_id' => $profileId,
        ':favorite_profile_id' => $favoriteProfileId
    ]);

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}