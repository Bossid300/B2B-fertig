<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");
require_once 'profileVisibility.php';

session_start();
$ownProfileId = (string) ($_SESSION['profile_id'] ?? '');

$stmt = $pdo->query(
    "SELECT * FROM profiles"
);

$data = $stmt->fetchAll(
    PDO::FETCH_ASSOC
);
foreach ($data as &$profile) {
    if ((string) ($profile['id'] ?? '') !== $ownProfileId) {
        $profile = sanitizePublicProfileRow($profile);
    }
}
unset($profile);

echo json_encode([
    "success" => true,
    "profiles" => $data
]);