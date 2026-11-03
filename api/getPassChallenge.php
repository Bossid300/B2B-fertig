<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

require_once 'db.php';

$id = (int)($_GET['id'] ?? 0);

$stmt = $pdo->prepare("
    SELECT *
    FROM pass_challenges
    WHERE id = ?
    LIMIT 1
");

$stmt->execute([$id]);

$challenge = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'challenge' => $challenge
]);