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

    $profileStmt = $pdo->prepare("
        SELECT id
        FROM profiles
        WHERE id = :profileId
        LIMIT 1
    ");
    $profileStmt->execute([
        ':profileId' => $data['profileId']
    ]);

    if (!$profileStmt->fetch(PDO::FETCH_ASSOC))
    {
        echo json_encode([
            'success' => false,
            'error' => 'profile_not_found'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO auth_users (
            id,
            email,
            password,
            profileId,
            createdAt,
            acceptedTerms,
            acceptedTermsDate
        )
        VALUES (
            :id,
            :email,
            :password,
            :profileId,
            :createdAt,
            :acceptedTerms,
            :acceptedTermsDate
        )
        ");

        $stmt->execute([
            ':id' => $data['id'],
            ':email' => $data['email'],
            ':password' => $data['password'],
            ':profileId' => $data['profileId'],
            ':createdAt' => time(),
            ':acceptedTerms' => 1,
            ':acceptedTermsDate' => date('Y-m-d H:i:s')
        ]);

    session_set_cookie_params([
        'httponly' => true,
        'secure' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
    session_regenerate_id(true);

    $_SESSION['profile_id'] = $data['profileId'];
    $_SESSION['auth_user_id'] = $data['id'];
    $_SESSION['login_time'] = time();


    @mail(
        'support@gigsda.com',
        'Neue Registrierung auf GIGSDA',
        "Neue Registrierung auf GIGSDA\n\n" .
        "Profil-ID: " . $data['profileId'] . "\n" .
        "Rolle: " . ($data['role'] ?? 'Unbekannt') . "\n" .
        "E-Mail: " . $data['email'] . "\n" .
        "Zeitpunkt: " . date('d.m.Y H:i:s') . "\n\n" .
        "https://www.gigsda.com"
    );

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $data['id'],
            'profileId' => $data['profileId']
        ]
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}