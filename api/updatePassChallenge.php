<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = (int)($data['id'] ?? 0);

$title = trim($data['title'] ?? '');
$secretWord = trim($data['secretWord'] ?? '');
$prize = trim($data['prize'] ?? '');

$stmt = $pdo->prepare("
    UPDATE pass_challenges
    SET
        title = ?,
        secret_word = ?,
        prize = ?
    WHERE id = ?
");

$stmt->execute([
    $title,
    $secretWord,
    $prize,
    $id
]);

echo json_encode([
    'success' => true
]);