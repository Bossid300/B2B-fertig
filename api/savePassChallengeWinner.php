<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$challengeId = (int)($data['challengeId'] ?? 0);
$ticketNumber = trim($data['ticketNumber'] ?? '');

if (!$challengeId || !$ticketNumber) {
    echo json_encode([
        'success' => false
    ]);
    exit;
}

$stmt = $pdo->prepare("
    UPDATE pass_challenges
    SET winner_ticket = ?
    WHERE id = ?
");

$stmt->execute([
    $ticketNumber,
    $challengeId
]);

echo json_encode([
    'success' => true
]);