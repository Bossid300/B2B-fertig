<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$challengeId = (int)($data['challengeId'] ?? 0);
$isActive = (int)($data['isActive'] ?? 0);

$stmt = $pdo->prepare("
    UPDATE pass_challenges
    SET is_active = ?
    WHERE id = ?
");

$stmt->execute([
    $isActive,
    $challengeId
]);

echo json_encode([
    'success' => true
]);