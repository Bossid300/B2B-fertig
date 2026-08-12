<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$data = json_decode(file_get_contents("php://input"), true);

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM profiles
        WHERE id = :id
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