<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

require_once("cors.php");

session_start();

$profileId = $_SESSION['profile_id'] ?? null;

if (!$profileId) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Nicht authentifiziert'
    ]);
    exit;
}

try {

    $stmt = $pdo->prepare("
        UPDATE profiles
        SET status = 'deactivated'
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $profileId
    ]);

    echo json_encode([
        'success' => true,
        'deactivated_id' => $profileId
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);

}