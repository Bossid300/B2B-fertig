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
        'error' => 'Nicht angemeldet'
    ]);

    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$requestId = is_array($input) ? ($input['requestId'] ?? null) : null;
$updates = is_array($input) ? ($input['updates'] ?? null) : null;

if (
    !$requestId
    || !is_array($updates)
    || array_keys($updates) !== ['status']
    || !in_array($updates['status'] ?? null, ['accepted', 'declined'], true)
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Ungültiger Request-Status'
    ]);

    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT *
        FROM requests
        WHERE id = :id
        LIMIT 1
        FOR UPDATE
    ");

    $stmt->execute([
        ':id' => $requestId
    ]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        $pdo->rollBack();
        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'Request nicht gefunden'
        ]);

        exit;
    }

    if ((string) $row['requested_profile_id'] !== (string) $actorProfileId) {
        $pdo->rollBack();
        http_response_code(403);

        echo json_encode([
            'success' => false,
            'error' => 'Keine Berechtigung für diesen Request'
        ]);

        exit;
    }

    if ($row['status'] !== 'pending') {
        $pdo->rollBack();
        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'Der Request ist nicht mehr offen'
        ]);

        exit;
    }

    $json = [];

    if (!empty($row['request_json'])) {
        $decoded = json_decode($row['request_json'], true);
        if (!is_array($decoded)) {
            throw new RuntimeException('Request-Daten sind ungültig');
        }
        $json = $decoded;
    }

    $updatedRequest = $json;
    $updatedRequest['requestId'] = $requestId;
    $updatedRequest['status'] = $updates['status'];
    $updatedRequest['updatedAt'] = round(microtime(true) * 1000);

    $requestJson = json_encode($updatedRequest, JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("
        UPDATE requests
        SET
            status = :status,
            request_json = :request_json,
            updated_at = :updated_at
        WHERE id = :id
          AND status = 'pending'
          AND requested_profile_id = :actor_profile_id
    ");

    $stmt->execute([
        ':status' => $updatedRequest['status'],
        ':request_json' => $requestJson,
        ':updated_at' => $updatedRequest['updatedAt'],
        ':id' => $requestId,
        ':actor_profile_id' => $actorProfileId
    ]);

    if ($stmt->rowCount() !== 1) {
        $pdo->rollBack();
        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'Der Request wurde zwischenzeitlich geändert'
        ]);

        exit;
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'requestId' => $requestId,
        'request' => $updatedRequest
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}