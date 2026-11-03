<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$challengeId = (int)($data['challengeId'] ?? 0);
$browserToken = trim($data['browserToken'] ?? '');

if (!$challengeId || !$browserToken) {
    echo json_encode([
        'success' => false,
        'message' => 'missing_data'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT ticket_number
    FROM pass_challenge_entries
    WHERE challenge_id = ?
    AND browser_token = ?
    LIMIT 1
");

$stmt->execute([
    $challengeId,
    $browserToken
]);

$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    echo json_encode([
        'success' => true,
        'alreadyJoined' => true,
        'ticketNumber' => $existing['ticket_number']
    ]);
    exit;
}

$ticketNumber = 'GIG-' . rand(10000, 99999);

$stmt = $pdo->prepare("
    INSERT INTO pass_challenge_entries
    (
        challenge_id,
        ticket_number,
        browser_token
    )
    VALUES
    (?, ?, ?)
");

$stmt->execute([
    $challengeId,
    $ticketNumber,
    $browserToken
]);

echo json_encode([
    'success' => true,
    'alreadyJoined' => false,
    'ticketNumber' => $ticketNumber
]);