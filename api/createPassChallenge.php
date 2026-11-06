<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$secretWord = $data['secretWord'] ?? '';
$prize = $data['prize'] ?? '';
$locationProfileId = trim(
    $data['locationProfileId'] ?? ''
);

$stmt = $pdo->prepare("
    INSERT INTO pass_challenges
    (
        location_profile_id,
        title,
        secret_word,
        prize
    )
    VALUES
    (?, ?, ?, ?)
");

$stmt->execute([
    $locationProfileId,
    $title,
    $secretWord,
    $prize
]);

echo json_encode([
    'success' => true
]);