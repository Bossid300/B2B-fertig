<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$data = json_decode(file_get_contents("php://input"), true);

try {

    $stmt = $pdo->prepare("
        SELECT
            p.*,
            (
                SELECT ma.id
                FROM media_usages mu
                INNER JOIN media_assets ma ON ma.id = mu.media_asset_id
                WHERE mu.entity_type = 'profile'
                  AND mu.entity_id = p.id
                  AND mu.usage_role = 'avatar'
                  AND mu.visibility = 'public'
                  AND mu.deleted_at IS NULL
                  AND ma.media_type = 'image'
                  AND ma.status = 'ready'
                  AND ma.deleted_at IS NULL
                ORDER BY mu.created_at DESC
                LIMIT 1
            ) AS avatar_media_id
        FROM profiles p
        WHERE p.id = :id
        LIMIT 1
    ");

    $stmt->execute([
        ':id' => $data['id']
    ]);

    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'profile' => $profile
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}