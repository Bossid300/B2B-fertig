<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

$data = json_decode(
    file_get_contents('php://input'),
    true
);

$stmt = $pdo->prepare("
    DELETE FROM budget_plans
    WHERE id = :id
");

$stmt->execute([
    ':id' => $data['id']
]);

echo json_encode([
    'success' => true
]);
