<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$data = json_decode(file_get_contents("php://input"), true);

try {

    $stmt = $pdo->prepare("
        UPDATE profiles
        SET profile_json = :profileJson
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $data['id'],
        ':profileJson' => json_encode($data['profile'])
    ]);

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}