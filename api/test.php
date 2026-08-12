<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$stmt = $pdo->query(
    "SELECT * FROM profiles"
);

$data = $stmt->fetchAll(
    PDO::FETCH_ASSOC
);

echo json_encode([
    "success" => true,
    "profiles" => $data
]);