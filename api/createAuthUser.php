<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $pdo->prepare("
    SELECT id
    FROM auth_users
    WHERE email = :email
    LIMIT 1
");

$stmt->execute([
    ':email' => $data['email']
]);

$existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existingUser)
{
    echo json_encode([
        'success' => false,
        'error' => 'email_exists'
    ]);

    exit;
}

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

    @mail(
        'support@gigsda.com',
        'Neue Registrierung auf GIGSDA',
        "Neue Registrierung auf GIGSDA\n\n" .
        "Profil-ID: " . $data['profileId'] . "\n" .
        "E-Mail: " . $data['email'] . "\n" .
        "Zeitpunkt: " . date('d.m.Y H:i:s') . "\n\n" .
        "https://www.gigsda.com"
    );

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}