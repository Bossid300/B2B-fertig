<?php

header('Content-Type: application/json');

require_once("cors.php");

require_once 'db.php';

try {

    $stmt = $pdo->query("
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
        ORDER BY created_at DESC
    ");

    $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "profiles" => $profiles
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);

}