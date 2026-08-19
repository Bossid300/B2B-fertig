<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

$profileId =
    $_GET['profileId'] ?? '';

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM invoices
        WHERE profile_id = :profileId
        ORDER BY created_at DESC
    ");

    $stmt->execute([
        ':profileId' => $profileId
    ]);

    $invoices =
        $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($invoices as &$invoice) {
            $profileStmt = $pdo->prepare("
                SELECT name, profile_json
                FROM profiles
                WHERE id = :profileId
                LIMIT 1
            ");
            $profileStmt->execute([
                ':profileId' => $invoice['profile_id']
            ]);
            $profile = $profileStmt->fetch(PDO::FETCH_ASSOC);

            if ($profile) {
                $invoice['name'] = $profile['name'];
                $profileJson = json_decode(
                    $profile['profile_json'],
                    true
                );
                $invoice['city'] =
                    $profileJson['city'] ?? '';

                $invoice['plz'] =
                    $profileJson['plz'] ?? '';

                $invoice['street'] =
                    $profileJson['street'] ?? '';

                $invoice['email'] =
                    $profileJson['email'] ?? '';

                $invoice['company_uid'] =
                    $profileJson['company_uid'] ?? '';

                $invoice['steuernummer'] =
                    $profileJson['steuernummer'] ?? '';
            }
        }

    echo json_encode([
        'success' => true,
        'invoices' => $invoices
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}
