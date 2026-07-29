<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

try {

    $stmt = $pdo->prepare("
        INSERT INTO profiles (
            id,
            name,
            role,
            city,
            bio
        )
        VALUES (
            :id,
            :name,
            :role,
            :city,
            :bio
        )
    ");

    $stmt->execute([
        ':id' => $data['id'],
        ':name' => $data['name'],
        ':role' => $data['role'],
        ':city' => $data['city'] ?? '',
        ':bio' => $data['bio'] ?? ''
    ]);

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}