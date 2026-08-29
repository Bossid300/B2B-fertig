<?php

header('Content-Type: application/json');

require_once 'db.php';
require_once("cors.php");
require_once 'SecurityService.php';

$data = json_decode(file_get_contents("php://input"), true);

$turnstileToken = $data['turnstileToken'] ?? '';
$turnstileSecret = '0x4AAAAAAEZ82QT4RkVVFqi8EQnweT54s8o';

if (empty($turnstileToken))
{
    echo json_encode([
        'success' => false,
        'error' => 'turnstile_missing'
    ]);

    exit;
}

$response = file_get_contents(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    false,
    stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-type: application/x-www-form-urlencoded",
            'content' => http_build_query([
                'secret'   => $turnstileSecret,
                'response' => $turnstileToken,
                'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
            ])
        ]
    ])
);

$turnstileResult =
    json_decode($response, true);

if (
    empty($turnstileResult['success'])
)
{
    echo json_encode([
        'success' => false,
        'error' => 'turnstile_failed'
    ]);

    exit;
}

$ip = SecurityService::getClientIp();

if (
    !SecurityService::canRegister($ip)
)
{
    echo json_encode([
        'success' => false,
        'error' => 'registration_limit'
    ]);

    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id
        FROM profiles
        WHERE id = :id
        LIMIT 1
    ");

    $stmt->execute([
        ':id' => $data['id']
    ]);

    $existingProfile = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingProfile)
    {
        echo json_encode([
            'success' => false,
            'error' => 'profile_exists'
        ]);

        exit;
    }
    
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

    SecurityService::recordRegistration(
        $ip,
        '',
        true
    );

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {

    SecurityService::recordRegistration(
        $ip,
        '',
        false
    );

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}
