<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$data = json_decode(file_get_contents("php://input"), true);

try {

    $stmt = $pdo->prepare("
        INSERT INTO profiles (
            id,
            name,
            role,
            city,
            bio,
            profile_json
        )
        VALUES (
            :id,
            :name,
            :role,
            :city,
            :bio,
            :profile_json
        )
    ");

    $stmt->execute([
        ':id' => $data['id'],
        ':name' => $data['name'],
        ':role' => $data['role'],
        ':city' => $data['city'] ?? '',
        ':bio' => $data['bio'] ?? '',
        ':profile_json' => $data['profile_json'] ?? null
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