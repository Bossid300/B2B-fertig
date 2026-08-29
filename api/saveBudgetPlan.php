<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!$data) {
        throw new Exception('Keine Daten erhalten');
    }

    $id = 'BUD-' . rand(1000, 9999);

    $stmt = $pdo->prepare("
        INSERT INTO budget_plans
        (
            id,
            title,
            owner_id,
            plan_json
        )
        VALUES
        (
            :id,
            :title,
            :owner_id,
            :plan_json
        )
    ");

    $stmt->execute([
        ':id' => $id,
        ':title' => $data['title'],
        ':owner_id' => $data['ownerId'],
        ':plan_json' => json_encode(
            $data,
            JSON_UNESCAPED_UNICODE
        )
    ]);

    echo json_encode([
        'success' => true,
        'id' => $id
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
