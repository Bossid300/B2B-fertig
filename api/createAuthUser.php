<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

try {

    $stmt = $pdo->prepare("
        INSERT INTO auth_users (
            id,
            email,
            password,
            profileId,
            createdAt
        )
        VALUES (
            :id,
            :email,
            :password,
            :profileId,
            :createdAt
        )
    ");

    $stmt->execute([
        ':id' => $data['id'],
        ':email' => $data['email'],
        ':password' => $data['password'],
        ':profileId' => $data['profileId'],
        ':createdAt' => time()
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