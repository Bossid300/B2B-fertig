<?php

header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/db.php';

function mediaRespond($status, $payload)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function mediaUuid()
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);

    return substr($hex, 0, 8) . '-' .
        substr($hex, 8, 4) . '-' .
        substr($hex, 12, 4) . '-' .
        substr($hex, 16, 4) . '-' .
        substr($hex, 20, 12);
}

function mediaStorageDirectory()
{
    $webspaceRoot = realpath(dirname(__DIR__));
    if ($webspaceRoot === false) {
        throw new RuntimeException('Das Webspace-Verzeichnis ist nicht erreichbar.');
    }

    $path = $webspaceRoot .
        DIRECTORY_SEPARATOR . 'uploads' .
        DIRECTORY_SEPARATOR . 'media';

    if (!is_dir($path) && !mkdir($path, 0700, true) && !is_dir($path)) {
        throw new RuntimeException('Das Upload-Verzeichnis konnte nicht angelegt werden.');
    }

    $resolvedPath = realpath($path);
    if ($resolvedPath === false) {
        throw new RuntimeException('Das Upload-Verzeichnis ist nicht erreichbar.');
    }

    $normalizedRoot = rtrim($webspaceRoot, DIRECTORY_SEPARATOR);
    $normalizedStorage = rtrim($resolvedPath, DIRECTORY_SEPARATOR);
    $prefix = $normalizedRoot . DIRECTORY_SEPARATOR;
    $isInsideWebspace = DIRECTORY_SEPARATOR === '\\'
        ? strncasecmp($normalizedStorage, $prefix, strlen($prefix)) === 0
        : strncmp($normalizedStorage, $prefix, strlen($prefix)) === 0;

    if (!$isInsideWebspace) {
        throw new RuntimeException(
            'Das Upload-Verzeichnis muss innerhalb des Webspace liegen.'
        );
    }

    return $resolvedPath;
}

function mediaCheckRequestOrigin()
{
    $fetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
    if ($fetchSite === 'cross-site') {
        mediaRespond(403, ['success' => false, 'error' => 'Cross-Site-Anfrage abgelehnt.']);
    }

    if ($fetchSite === 'same-origin') {
        return;
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }

    $originHost = parse_url($origin, PHP_URL_HOST);
    $originPort = parse_url($origin, PHP_URL_PORT);
    $requestHost = $_SERVER['HTTP_HOST'] ?? '';
    $requestParts = parse_url('//' . $requestHost);
    $requestPort = $requestParts['port'] ?? null;

    if (
        !$originHost ||
        strtolower($originHost) !== strtolower($requestParts['host'] ?? '') ||
        ($originPort !== $requestPort && !(
            ($originPort === null && $requestPort === 80) ||
            ($originPort === null && $requestPort === 443)
        ))
    ) {
        mediaRespond(403, ['success' => false, 'error' => 'Ungültiger Anfrage-Ursprung.']);
    }
}

function mediaRequireSession()
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $profileId = $_SESSION['profile_id'] ?? null;
    $authUserId = $_SESSION['auth_user_id'] ?? null;

    if (!$profileId || !$authUserId) {
        mediaRespond(401, ['success' => false, 'error' => 'Nicht angemeldet.']);
    }

    return [(string) $profileId, (string) $authUserId];
}

function mediaDownload($pdo, $profileId)
{
    $id = $_GET['id'] ?? '';
    if (!preg_match('/^[a-f0-9-]{36}$/i', $id)) {
        mediaRespond(400, ['success' => false, 'error' => 'Ungültige Medien-ID.']);
    }

    $stmt = $pdo->prepare("
        SELECT storage_key, original_filename, mime_type, size_bytes
        FROM media_assets
        WHERE id = :id
          AND owner_profile_id = :owner_profile_id
          AND status = 'ready'
          AND deleted_at IS NULL
        LIMIT 1
    ");
    $stmt->execute([
        ':id' => $id,
        ':owner_profile_id' => $profileId
    ]);
    $asset = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$asset) {
        mediaRespond(404, ['success' => false, 'error' => 'Medium nicht gefunden.']);
    }

    $storageDirectory = mediaStorageDirectory();
    $filePath = realpath(
        $storageDirectory . DIRECTORY_SEPARATOR . $asset['storage_key']
    );

    if (
        $filePath === false ||
        dirname($filePath) !== $storageDirectory ||
        !is_file($filePath)
    ) {
        mediaRespond(404, ['success' => false, 'error' => 'Datei ist nicht verfügbar.']);
    }

    $filename = preg_replace('/[\r\n\x00-\x1F\x7F]/', '', $asset['original_filename']);
    header('Content-Type: application/octet-stream');
    header('Content-Length: ' . filesize($filePath));
    header('Content-Disposition: attachment; filename="download"; filename*=UTF-8\'\'' . rawurlencode($filename));
    header('Cache-Control: private, no-store');
    readfile($filePath);
    exit;
}

function mediaServeImage($pdo, $assetId, $profileId = null, $avatarOnly = false)
{
    if (!preg_match('/^[a-f0-9-]{36}$/i', $assetId)) {
        mediaRespond(400, ['success' => false, 'error' => 'Ungültige Medien-ID.']);
    }

    if ($avatarOnly) {
        $stmt = $pdo->prepare("
            SELECT ma.storage_key, ma.mime_type
            FROM media_assets ma
            INNER JOIN media_usages mu ON mu.media_asset_id = ma.id
            WHERE ma.id = :id
              AND ma.media_type = 'image'
              AND ma.status = 'ready'
              AND ma.deleted_at IS NULL
              AND mu.entity_type = 'profile'
              AND mu.usage_role = 'avatar'
              AND mu.visibility = 'public'
              AND mu.deleted_at IS NULL
            LIMIT 1
        ");
        $stmt->execute([':id' => $assetId]);
    } else {
        $stmt = $pdo->prepare("
            SELECT storage_key, mime_type
            FROM media_assets
            WHERE id = :id
              AND owner_profile_id = :owner_profile_id
              AND media_type = 'image'
              AND status = 'ready'
              AND deleted_at IS NULL
            LIMIT 1
        ");
        $stmt->execute([
            ':id' => $assetId,
            ':owner_profile_id' => $profileId
        ]);
    }

    $asset = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$asset) {
        mediaRespond(404, ['success' => false, 'error' => 'Bild nicht gefunden.']);
    }

    $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($asset['mime_type'], $allowedImageTypes, true)) {
        mediaRespond(415, ['success' => false, 'error' => 'Ungültiger Bildtyp.']);
    }

    $storageDirectory = mediaStorageDirectory();
    $filePath = realpath(
        $storageDirectory . DIRECTORY_SEPARATOR . $asset['storage_key']
    );
    if (
        $filePath === false ||
        dirname($filePath) !== $storageDirectory ||
        !is_file($filePath)
    ) {
        mediaRespond(404, ['success' => false, 'error' => 'Bilddatei ist nicht verfügbar.']);
    }

    header('Content-Type: ' . $asset['mime_type']);
    header('Content-Length: ' . filesize($filePath));
    header('Content-Disposition: inline; filename="image"');
    header($avatarOnly ? 'Cache-Control: public, max-age=300' : 'Cache-Control: private, no-store');
    readfile($filePath);
    exit;
}

function mediaSetAvatar($pdo, $profileId, $authUserId)
{
    $input = json_decode(file_get_contents('php://input'), true);
    $assetId = $input['media_asset_id'] ?? '';
    if (!is_string($assetId) || !preg_match('/^[a-f0-9-]{36}$/i', $assetId)) {
        mediaRespond(400, ['success' => false, 'error' => 'Ungültige Medien-ID.']);
    }

    $pdo->beginTransaction();

    try {
        $profileStmt = $pdo->prepare("
            SELECT id
            FROM profiles
            WHERE id = :profile_id
            LIMIT 1
            FOR UPDATE
        ");
        $profileStmt->execute([':profile_id' => $profileId]);
        if (!$profileStmt->fetchColumn()) {
            throw new RuntimeException('Profil nicht gefunden.');
        }

        $assetStmt = $pdo->prepare("
            SELECT id
            FROM media_assets
            WHERE id = :id
              AND owner_profile_id = :owner_profile_id
              AND media_type = 'image'
              AND status = 'ready'
              AND deleted_at IS NULL
            LIMIT 1
            FOR UPDATE
        ");
        $assetStmt->execute([
            ':id' => $assetId,
            ':owner_profile_id' => $profileId
        ]);
        if (!$assetStmt->fetchColumn()) {
            $pdo->rollBack();
            mediaRespond(404, [
                'success' => false,
                'error' => 'Eigenes, aktives Bildmedium nicht gefunden.'
            ]);
        }

        $deactivateStmt = $pdo->prepare("
            UPDATE media_usages
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE entity_type = 'profile'
              AND entity_id = :profile_id
              AND usage_role = 'avatar'
              AND deleted_at IS NULL
        ");
        $deactivateStmt->execute([':profile_id' => $profileId]);

        $usageStmt = $pdo->prepare("
            INSERT INTO media_usages (
                id,
                media_asset_id,
                entity_type,
                entity_id,
                usage_role,
                visibility,
                created_by_auth_user_id
            ) VALUES (
                :id,
                :media_asset_id,
                'profile',
                :entity_id,
                'avatar',
                'public',
                :created_by_auth_user_id
            )
        ");
        $usageStmt->execute([
            ':id' => mediaUuid(),
            ':media_asset_id' => $assetId,
            ':entity_id' => $profileId,
            ':created_by_auth_user_id' => $authUserId
        ]);

        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }

    mediaRespond(200, [
        'success' => true,
        'media_asset_id' => $assetId,
        'avatar_url' => '/api/media.php?avatar_asset=' . rawurlencode($assetId)
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['avatar_asset'])) {
    try {
        mediaServeImage($pdo, (string) $_GET['avatar_asset'], null, true);
    } catch (Throwable $e) {
        error_log('Media avatar delivery error: ' . $e->getMessage());
        mediaRespond(500, ['success' => false, 'error' => 'Avatar konnte nicht geladen werden.']);
    }
}

mediaCheckRequestOrigin();
[$profileId, $authUserId] = mediaRequireSession();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['preview'])) {
            mediaServeImage($pdo, (string) $_GET['preview'], $profileId);
        }

        if (isset($_GET['id'])) {
            mediaDownload($pdo, $profileId);
        }

        $stmt = $pdo->prepare("
            SELECT id, media_type, original_filename, mime_type, size_bytes, status, created_at
            FROM media_assets
            WHERE owner_profile_id = :owner_profile_id
              AND status = 'ready'
              AND deleted_at IS NULL
            ORDER BY created_at DESC
        ");
        $stmt->execute([':owner_profile_id' => $profileId]);

        mediaRespond(200, [
            'success' => true,
            'assets' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Allow: GET, POST');
        mediaRespond(405, ['success' => false, 'error' => 'Methode nicht erlaubt.']);
    }

    if (($_GET['action'] ?? '') === 'set-avatar') {
        mediaSetAvatar($pdo, $profileId, $authUserId);
    }

    if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
        mediaRespond(400, ['success' => false, 'error' => 'Keine Datei empfangen.']);
    }

    $upload = $_FILES['file'];
    if (
        !isset($upload['error'], $upload['tmp_name'], $upload['name'], $upload['size']) ||
        !is_int($upload['error']) ||
        !is_string($upload['tmp_name']) ||
        !is_string($upload['name']) ||
        !is_int($upload['size'])
    ) {
        mediaRespond(400, ['success' => false, 'error' => 'Ungültige Upload-Daten.']);
    }

    if ($upload['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => 'Die Datei überschreitet das Serverlimit.',
            UPLOAD_ERR_FORM_SIZE => 'Die Datei überschreitet das erlaubte Größenlimit.',
            UPLOAD_ERR_PARTIAL => 'Die Datei wurde nur teilweise übertragen.',
            UPLOAD_ERR_NO_FILE => 'Keine Datei ausgewählt.',
            UPLOAD_ERR_NO_TMP_DIR => 'Temporärer Upload-Ordner fehlt auf dem Server.',
            UPLOAD_ERR_CANT_WRITE => 'Datei konnte auf dem Server nicht gespeichert werden.',
            UPLOAD_ERR_EXTENSION => 'Der Server hat den Upload abgebrochen.'
        ];
        $error = $uploadErrors[$upload['error']] ?? 'Datei-Upload fehlgeschlagen.';
        mediaRespond(400, ['success' => false, 'error' => $error]);
    }

    if (!is_uploaded_file($upload['tmp_name'])) {
        mediaRespond(400, ['success' => false, 'error' => 'Ungültiger Upload.']);
    }

    if (!class_exists('finfo')) {
        throw new RuntimeException('Die PHP-Fileinfo-Erweiterung ist auf dem Server nicht verfügbar.');
    }

    $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($upload['tmp_name']);
    $extension = strtolower(pathinfo($upload['name'], PATHINFO_EXTENSION));
    $allowedTypes = [
        'image/jpeg' => ['image', ['jpg', 'jpeg'], 25 * 1024 * 1024],
        'image/png' => ['image', ['png'], 25 * 1024 * 1024],
        'image/gif' => ['image', ['gif'], 25 * 1024 * 1024],
        'image/webp' => ['image', ['webp'], 25 * 1024 * 1024],
        'application/pdf' => ['document', ['pdf'], 50 * 1024 * 1024],
        'application/msword' => ['document', ['doc'], 50 * 1024 * 1024],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => ['document', ['docx'], 50 * 1024 * 1024],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => ['document', ['xlsx'], 50 * 1024 * 1024],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => ['document', ['pptx'], 50 * 1024 * 1024],
        'text/plain' => ['document', ['txt'], 50 * 1024 * 1024],
        'audio/mpeg' => ['audio', ['mp3'], 100 * 1024 * 1024],
        'audio/mp4' => ['audio', ['m4a', 'mp4'], 100 * 1024 * 1024],
        'audio/aac' => ['audio', ['aac'], 100 * 1024 * 1024],
        'audio/wav' => ['audio', ['wav'], 100 * 1024 * 1024],
        'audio/x-wav' => ['audio', ['wav'], 100 * 1024 * 1024],
        'audio/ogg' => ['audio', ['ogg', 'oga'], 100 * 1024 * 1024],
        'audio/flac' => ['audio', ['flac'], 100 * 1024 * 1024],
        'audio/x-flac' => ['audio', ['flac'], 100 * 1024 * 1024],
        'video/mp4' => ['video', ['mp4'], 250 * 1024 * 1024],
        'video/webm' => ['video', ['webm'], 250 * 1024 * 1024],
        'video/quicktime' => ['video', ['mov'], 250 * 1024 * 1024]
    ];

    if (
        !isset($allowedTypes[$mimeType]) ||
        !in_array($extension, $allowedTypes[$mimeType][1], true)
    ) {
        mediaRespond(415, ['success' => false, 'error' => 'Dateiformat wird nicht unterstützt oder stimmt nicht mit dem Dateiinhalt überein.']);
    }

    [$mediaType, , $maxBytes] = $allowedTypes[$mimeType];
    if ($upload['size'] < 1 || $upload['size'] > $maxBytes) {
        mediaRespond(413, [
            'success' => false,
            'error' => 'Datei zu groß. Maximale Größe für diesen Medientyp: ' . (int) ($maxBytes / 1024 / 1024) . ' MB.'
        ]);
    }

    $storageDirectory = mediaStorageDirectory();
    $assetId = mediaUuid();
    $storageKey = $assetId . '.' . $extension;
    $targetPath = $storageDirectory . DIRECTORY_SEPARATOR . $storageKey;

    if (!move_uploaded_file($upload['tmp_name'], $targetPath)) {
        throw new RuntimeException('Datei konnte nicht im Medienspeicher abgelegt werden.');
    }
    if (!chmod($targetPath, 0600)) {
        unlink($targetPath);
        throw new RuntimeException('Dateiberechtigungen konnten nicht sicher gesetzt werden.');
    }

    $checksum = hash_file('sha256', $targetPath);
    if ($checksum === false) {
        unlink($targetPath);
        throw new RuntimeException('Datei konnte nicht auf Integrität geprüft werden.');
    }

    $originalFilename = basename(str_replace('\\', '/', $upload['name']));
    $originalFilename = preg_replace('/[\x00-\x1F\x7F]/', '', $originalFilename);
    $originalFilename = substr($originalFilename, 0, 255);
    if ($originalFilename === '') {
        $originalFilename = 'upload.' . $extension;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO media_assets (
                id,
                owner_profile_id,
                uploaded_by_auth_user_id,
                media_type,
                storage_key,
                original_filename,
                mime_type,
                size_bytes,
                checksum_sha256,
                status
            ) VALUES (
                :id,
                :owner_profile_id,
                :uploaded_by_auth_user_id,
                :media_type,
                :storage_key,
                :original_filename,
                :mime_type,
                :size_bytes,
                :checksum_sha256,
                'ready'
            )
        ");
        $stmt->execute([
            ':id' => $assetId,
            ':owner_profile_id' => $profileId,
            ':uploaded_by_auth_user_id' => $authUserId,
            ':media_type' => $mediaType,
            ':storage_key' => $storageKey,
            ':original_filename' => $originalFilename,
            ':mime_type' => $mimeType,
            ':size_bytes' => $upload['size'],
            ':checksum_sha256' => $checksum
        ]);
    } catch (Throwable $e) {
        if (is_file($targetPath)) {
            unlink($targetPath);
        }
        throw $e;
    }

    mediaRespond(201, [
        'success' => true,
        'asset' => [
            'id' => $assetId,
            'media_type' => $mediaType,
            'original_filename' => $originalFilename,
            'mime_type' => $mimeType,
            'size_bytes' => (int) $upload['size'],
            'status' => 'ready'
        ]
    ]);
} catch (Throwable $e) {
    error_log('Media API error: ' . $e->getMessage());
    mediaRespond(500, [
        'success' => false,
        'error' => 'Medienvorgang konnte nicht abgeschlossen werden.'
    ]);
}
