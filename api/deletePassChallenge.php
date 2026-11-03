<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$challengeId = (int)($data['challengeId'] ?? 0);

if (!$challengeId) {

    echo json_encode([
        'success' => false
    ]);

    exit;
}

/*
 * zuerst Teilnehmer löschen
 */
$stmt = $pdo->prepare("
    DELETE FROM pass_challenge_entries
    WHERE challenge_id = ?
");

$stmt->execute([
    $challengeId
]);

/*
 * dann Challenge löschen
 */
$stmt = $pdo->prepare("
    DELETE FROM pass_challenges
    WHERE id = ?
");

$stmt->execute([
    $challengeId
]);

echo json_encode([
    'success' => true
]);