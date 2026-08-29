<?php

header('Content-Type: application/json');

require_once 'db.php';
require_once("cors.php");
require_once 'SecurityService.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$ip = SecurityService::getClientIp();

if (SecurityService::isIpLocked($ip))
{
    echo json_encode([
        'success' => false,
        'user' => null
    ]);
    exit;
}

if (SecurityService::isAccountLocked($email))
{
    echo json_encode([
        'success' => false,
        'user' => null
    ]);
    exit;
}
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
    if ($user)
    {
        SecurityService::recordLoginAttempt(
            $email,
            $ip,
            true
        );
    }
    else
    {
        SecurityService::recordLoginAttempt(
            $email,
            $ip,
            false
        );

        SecurityService::evaluateLocks(
            $email,
            $ip
        );
    }

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