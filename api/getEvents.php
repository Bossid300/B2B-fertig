<?php

header('Content-Type: application/json');

require_once 'db.php';

try {

    $stmt = $pdo->query("
        SELECT *
        FROM events
        ORDER BY created_at DESC
    ");

    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "events" => $events
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);

}