<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

require_once("cors.php");

try {

    $input = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (
        !$input ||
        empty($input['id'])
    ) {
        throw new Exception(
            'Profil-ID fehlt'
        );
    }

    $stmt = $pdo->prepare("
        DELETE FROM profiles
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $input['id']
    ]);

    echo json_encode([
        'success' => true,
        'deleted_id' => $input['id']
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);

}