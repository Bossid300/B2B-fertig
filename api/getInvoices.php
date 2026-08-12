<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$profileId =
    $_GET['profileId'] ?? '';

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM invoices
        WHERE profile_id = :profileId
        ORDER BY created_at DESC
    ");

    $stmt->execute([
        ':profileId' => $profileId
    ]);

    $invoices =
        $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'invoices' => $invoices
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}
