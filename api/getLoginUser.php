<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM auth_users
        WHERE email = :email
        AND password = :password
        LIMIT 1
    ");

    $stmt->execute([
        ':email' => $email,
        ':password' => $password
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => !!$user,
        'user' => $user
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}