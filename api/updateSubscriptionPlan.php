<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(
    file_get_contents('php://input'),
    true
);

$profileId =
    $data['profileId'] ?? '';

$plan =
    $data['plan'] ?? 'COMMUNITY';

try {

    $price = 0;

    if ($plan === 'PRO') {
        $price = 9.90;
    }

    if ($plan === 'AGENCY') {
        $price = 24.90;
    }

    $orderStmt = $pdo->prepare("
        INSERT INTO subscription_orders (
            profile_id,
            plan,
            price,
            status
        )
        VALUES (
            :profile_id,
            :plan,
            :price,
            :status
        )
    ");

    $orderStmt->execute([
        ':profile_id' => $profileId,
        ':plan'       => $plan,
        ':price'      => $price,
        ':status'     => 'pending'
    ]);

    echo json_encode([
        'success' => true,
        'plan' => $plan
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}