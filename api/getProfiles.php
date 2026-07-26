<?php

header('Content-Type: application/json');

require_once 'db.php';

try {

    $stmt = $pdo->query("
        SELECT *
        FROM profiles
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