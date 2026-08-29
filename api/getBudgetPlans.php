<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

try {

$data = json_decode(
    file_get_contents('php://input'),
    true
);

$stmt = $pdo->prepare("
    SELECT *
    FROM budget_plans
    WHERE owner_id = :owner_id
    ORDER BY created_at DESC
");

$stmt->execute([
    ':owner_id' => $data['ownerId']
]);

$plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'plans' => $plans
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}