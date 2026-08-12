<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$profileId =
    $_GET['profileId'] ?? '';

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM subscription_orders
        WHERE profile_id = :profileId
        AND status = 'pending'
        ORDER BY created_at DESC
    ");

    $stmt->execute([
        ':profileId' => $profileId
    ]);

    echo json_encode([
        'success' => true,
        'orders' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}