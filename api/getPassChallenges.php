<?php

header('Content-Type: application/json');

require_once 'db.php';

$locationProfileId = trim(
    $_GET['location_profile_id'] ?? ''
);

$stmt = $pdo->prepare("
    SELECT
        pc.*,
        COUNT(pce.id) AS participants
    FROM pass_challenges pc
    LEFT JOIN pass_challenge_entries pce
        ON pce.challenge_id = pc.id
    WHERE pc.location_profile_id = ?
    GROUP BY pc.id
    ORDER BY pc.id DESC
");

$stmt->execute([$locationProfileId]);

$challenges = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'challenges' => $challenges
]);