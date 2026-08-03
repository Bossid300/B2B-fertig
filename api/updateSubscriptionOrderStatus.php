<?php

header('Content-Type: application/json');

require_once 'db.php';

$data = json_decode(
    file_get_contents('php://input'),
    true
);

$orderId = $data['orderId'] ?? 0;
$status  = $data['status'] ?? 'pending';

try {

    $stmt = $pdo->prepare("
        UPDATE subscription_orders
        SET status = :status
        WHERE id = :orderId
    ");

    $stmt->execute([
        ':status'  => $status,
        ':orderId' => $orderId
    ]);

    if ($status === 'paid') {

        $orderStmt = $pdo->prepare("
            SELECT *
            FROM subscription_orders
            WHERE id = :id
            LIMIT 1
        ");

        $orderStmt->execute([
            ':id' => $orderId
        ]);

        $order = $orderStmt->fetch(
            PDO::FETCH_ASSOC
        );

        if ($order) {

            $profileStmt = $pdo->prepare("
                UPDATE profiles
                SET subscription_plan = :plan
                WHERE id = :profileId
            ");

            $profileStmt->execute([
                ':plan'      => $order['plan'],
                ':profileId' => $order['profile_id']
            ]);

            // danach Rechnung erzeugen
            $invoiceNumber =
                'RE-' .
                date('Y') .
                '-' .
                str_pad(
                    $orderId,
                    4,
                    '0',
                    STR_PAD_LEFT
                );

            $invoiceStmt = $pdo->prepare("
                INSERT INTO invoices (
                    order_id,
                    invoice_number,
                    profile_id,
                    plan,
                    amount
                )
                VALUES (
                    :order_id,
                    :invoice_number,
                    :profile_id,
                    :plan,
                    :amount
                )
            ");

            $invoiceStmt->execute([
                ':order_id'       => $order['id'],
                ':invoice_number' => $invoiceNumber,
                ':profile_id'     => $order['profile_id'],
                ':plan'           => $order['plan'],
                ':amount'         => $order['price']
            ]);

        }

    }

    echo json_encode([
        'success' => true,
        'status'  => $status
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage()
    ]);

}