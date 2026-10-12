<?php

header('Content-Type: application/json');

require_once 'db.php';
require_once 'cors.php';

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$email = trim($data['email'] ?? '');

if (!$email)
{
    echo json_encode([
        'success' => false
    ]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT id,email
    FROM auth_users
    WHERE email = :email
    LIMIT 1
");

$stmt->execute([
    ':email' => $email
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user)
{
    echo json_encode([
        'success' => true
    ]);
    exit;
}

$token = bin2hex(random_bytes(32));

$expires = time() + 3600;

$update = $pdo->prepare("
    UPDATE auth_users
    SET
        resetToken = :token,
        resetExpires = :expires
    WHERE id = :id
");

$update->execute([
    ':token' => $token,
    ':expires' => $expires,
    ':id' => $user['id']
]);

$link =
"https://www.gigsda.com/?resetToken=" .
$token;
 
$message =
"Hallo,\n\n" .
"Du hast eine Passwort-Zurücksetzung für dein GIGSDA-Konto angefordert.\n\n" .
"Bitte klicke auf folgenden Link:\n\n" .
$link .
"\n\n" .
"Der Link ist 1 Stunde gültig.\n\n" .
"Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.\n\n" .
"Team GIGSDA";

$headers = [];
$headers[] = "From: support@gigsda.com";
$headers[] = "Reply-To: support@gigsda.com";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$mailSent = mail(
    $email,
    "GIGSDA Passwort zurücksetzen",
    $message,
    implode("\r\n", $headers)
);

echo json_encode([
    'success' => true
]);