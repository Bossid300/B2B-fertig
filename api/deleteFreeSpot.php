<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$data = json_decode(
    file_get_contents('php://input'),
    true
);

if (!$data) {
    echo json_encode([
        'success' => false,
        'error' => 'Keine Daten erhalten'
    ]);
    exit;
}

$id = (int)($data['id'] ?? 0);
$ownerId = trim($data['owner_id'] ?? '');

if (!$id || !$ownerId) {
    echo json_encode([
        'success' => false,
        'error' => 'id und owner_id sind erforderlich'
    ]);
    exit;
}

try {

    $sql = "
        UPDATE free_spots
        SET
            status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
          AND owner_id = :owner_id
          AND status = 'active'
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $id,
        ':owner_id' => $ownerId
    ]);

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'success' => false,
            'error' => 'Free Spot nicht gefunden oder keine Berechtigung'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'id' => $id
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}