<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cors.php';

$input = json_decode(file_get_contents('php://input'), true);

$requestId = $input['requestId'] ?? null;
$updates = $input['updates'] ?? [];

if (!$requestId || !is_array($updates)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'requestId oder updates fehlen'
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
            'error' => 'Request nicht gefunden'
        ]);

        exit;
    }

    $json = [];

    if (!empty($row['request_json'])) {
        $decoded = json_decode($row['request_json'], true);
        if (is_array($decoded)) {
            $json = $decoded;
        }
    }

    $updatedRequest = array_merge(
        $json,
        $updates,
        [
            'requestId' => $requestId,
            'updatedAt' => $updates['updatedAt'] ?? round(microtime(true) * 1000)
        ]
    );

    $status =
        $updatedRequest['status']
        ?? $row['status'];

    $note =
        $updatedRequest['note']
        ?? $row['note'];

    $requestJson = json_encode($updatedRequest, JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("
        UPDATE requests
        SET
            status = :status,
            note = :note,
            request_json = :request_json,
            updated_at = :updated_at
        WHERE id = :id
    ");

    $stmt->execute([
        ':status' => $status,
        ':note' => $note,
        ':request_json' => $requestJson,
        ':updated_at' => $updatedRequest['updatedAt'],
        ':id' => $requestId
    ]);

    echo json_encode([
        'success' => true,
        'requestId' => $requestId,
        'request' => $updatedRequest
    ]);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}