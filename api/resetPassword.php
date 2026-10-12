<?php

header('Content-Type: application/json');

require_once 'db.php';
require_once 'cors.php';

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$token = trim($data['token'] ?? '');
$password = trim($data['password'] ?? '');

if (!$token || !$password) {
    echo json_encode([
        'success' => false,
        'error' => 'Fehlende Daten'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT *
    FROM auth_users
    WHERE resetToken = :token
    LIMIT 1
");

$stmt->execute([
    ':token' => $token
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode([
        'success' => false,
        'error' => 'Ungültiger Token'
    ]);
    exit;
}

if ($user['resetExpires'] < time()) {
    echo json_encode([
        'success' => false,
        'error' => 'Der Link ist abgelaufen'
    ]);
    exit;
}

$update = $pdo->prepare("
    UPDATE auth_users
    SET
        password = :password,
        resetToken = NULL,
        resetExpires = NULL
    WHERE id = :id
");

$update->execute([
    ':password' => $password,
    ':id' => $user['id']
]);

echo json_encode([
    'success' => true
]);