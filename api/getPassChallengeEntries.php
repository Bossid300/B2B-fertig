<?php

header('Content-Type: application/json');

require_once 'db.php';

$challengeId = (int)($_GET['challenge_id'] ?? 0);

$stmt = $pdo->prepare("
    SELECT
        id,
        ticket_number,
        created_at
    FROM pass_challenge_entries
    WHERE challenge_id = ?
    ORDER BY id DESC
");

$stmt->execute([$challengeId]);

$entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'entries' => $entries
]);