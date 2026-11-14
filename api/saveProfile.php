<?php

header('Content-Type: application/json');

require_once 'db.php';

require_once("cors.php");

session_start();

$profileId = $_SESSION['profile_id'] ?? null;

if (!$profileId) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Nicht authentifiziert'
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$profile = $data['profile'] ?? null;

if (!is_array($profile)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Ungültige Profildaten'
    ]);
    exit;
}

$profilePatch = $profile;
$profile['id'] = $profileId;

try {
    $pdo->beginTransaction();

    $profileStmt = $pdo->prepare("
        SELECT profile_json
        FROM profiles
        WHERE id = :id
        FOR UPDATE
    ");
    $profileStmt->execute([
        ':id' => $profileId
    ]);
    $storedProfileJson = $profileStmt->fetchColumn();

    if ($storedProfileJson === false) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Profil nicht gefunden'
        ]);
        exit;
    }

    $storedProfile = $storedProfileJson
        ? json_decode($storedProfileJson, true)
        : [];
    if (!is_array($storedProfile)) {
        throw new RuntimeException('Gespeicherte Profildaten sind ungültig.');
    }

    $profile = array_replace($storedProfile, $profile);
    $profile['id'] = $profileId;

    $stmt = $pdo->prepare("
        UPDATE profiles
        SET profile_json = :profileJson
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $profileId,
        ':profileJson' => json_encode($profile)
    ]);

    $pdo->commit();

    if (array_key_exists('show_avatarUrl', $profilePatch) || array_key_exists('show_stamm', $profilePatch)) {
        $avatarVisibility = (
            ($profile['show_avatarUrl'] ?? true) !== false &&
            ($profile['show_stamm'] ?? true) !== false
        ) ? 'public' : 'owner';
        $avatarStmt = $pdo->prepare("
            UPDATE media_usages
            SET visibility = :visibility
            WHERE entity_type = 'profile'
              AND entity_id = :id
              AND usage_role = 'avatar'
              AND deleted_at IS NULL
        ");
        $avatarStmt->execute([
            ':visibility' => $avatarVisibility,
            ':id' => $profileId
        ]);
    }

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);

}