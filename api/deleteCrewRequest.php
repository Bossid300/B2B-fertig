<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

session_start();

$actorProfileId = $_SESSION['profile_id'] ?? null;

if (!$actorProfileId) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'error'   => 'Nicht angemeldet'
    ]);

    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$requestId = $input['requestId'] ?? null;

if (!$requestId) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error'   => 'requestId fehlt'
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM requests
        WHERE id = :id
        LIMIT 1
    ");

    $stmt->execute([
        ':id' => $requestId
    ]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error'   => 'Request nicht gefunden'
        ]);

        exit;
    }

    $deleteStmt = $pdo->prepare("
        DELETE FROM requests
        WHERE id = :id
    ");

    $deleteStmt->execute([
        ':id' => $requestId
    ]);

    echo json_encode([
        'success' => true
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage()
    ]);
}