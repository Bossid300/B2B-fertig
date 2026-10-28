CREATE TABLE IF NOT EXISTS media_assets (
    id CHAR(36) NOT NULL,
    owner_profile_id VARCHAR(128) NOT NULL,
    uploaded_by_auth_user_id VARCHAR(128) NOT NULL,
    media_type ENUM('image', 'document', 'audio', 'video') NOT NULL,
    storage_key VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(127) NOT NULL,
    size_bytes BIGINT UNSIGNED NOT NULL,
    checksum_sha256 CHAR(64) NOT NULL,
    status ENUM('ready', 'deleted') NOT NULL DEFAULT 'ready',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_media_assets_storage_key (storage_key),
    KEY idx_media_assets_owner_created (owner_profile_id, created_at),
    KEY idx_media_assets_owner_type (owner_profile_id, media_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_usages (
    id CHAR(36) NOT NULL,
    media_asset_id CHAR(36) NOT NULL,
    entity_type ENUM('profile', 'event') NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    usage_role VARCHAR(64) NOT NULL,
    collection_key VARCHAR(128) NULL,
    position INT UNSIGNED NOT NULL DEFAULT 0,
    label VARCHAR(255) NULL,
    visibility ENUM('public', 'owner', 'crew') NOT NULL DEFAULT 'owner',
    access_context_id VARCHAR(128) NULL,
    metadata_json JSON NULL,
    created_by_auth_user_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_media_usages_asset (media_asset_id, deleted_at),
    KEY idx_media_usages_entity (entity_type, entity_id, usage_role, position),
    CONSTRAINT fk_media_usages_asset
        FOREIGN KEY (media_asset_id) REFERENCES media_assets (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
