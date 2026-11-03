<?php

function stripPrivateProfileFields(array $profile): array
{
    $fieldMap = [
        'show_stamm' => [
            'category', 'project_name', 'Klarname', 'name', 'vorname', 'nachname',
            'phone', 'email', 'street', 'plz', 'city', 'location', 'lat', 'lng', 'website',
            'genre', 'description', 'avatarUrl', 'avatarMediaUrl', 'avatarMediaId',
            'avatar_media_id'
        ],
        'show_name_real' => ['name', 'display_name', 'vorname', 'nachname'],
        'show_name' => ['name', 'display_name'],
        'show_vorname' => ['vorname', 'display_name'],
        'show_nachname' => ['nachname', 'display_name'],
        'show_Klarname' => ['Klarname', 'display_name'],
        'show_category' => ['category', 'project_name'],
        'show_phone' => ['phone'],
        'show_email' => ['email'],
        'show_address' => ['street', 'plz', 'city', 'lat', 'lng'],
        'show_website' => ['website'],
        'show_genre' => ['genre'],
        'show_description' => ['description'],
        'show_avatarUrl' => ['avatarUrl', 'avatarMediaUrl', 'avatarMediaId', 'avatar_media_id'],
        'show_bio' => [
            'bio_einleitung', 'bio_karriere', 'bio_privates',
            'einleitung', 'karriere', 'privates'
        ],
        'show_bio_einleitung' => ['bio_einleitung'],
        'show_bio_karriere' => ['bio_karriere'],
        'show_bio_privates' => ['bio_privates'],
        'show_avail' => ['general_status', 'avail_days'],
        'show_compliance' => ['compliance'],
        'show_docs' => ['documents'],
        'show_equipment' => ['equipment'],
        'show_finance' => [
            'rate_hour', 'rate_day', 'payment_terms', 'tax_type', 'company_uid',
            'uid', 'steuernummer', 'gage_min', 'gage_max', 'duration_max',
            'mindestgage', 'wunschgage', 'fahrtkosten', 'bank_name', 'bank_iban',
            'bank_bic', 'tax_id', 'paypal_link'
        ],
        'show_gallery' => [
            'gallery_slot1_url', 'gallery_slot1_title', 'gallery_slot2_url',
            'gallery_slot2_title', 'gallery_slot3_url', 'gallery_slot3_title',
            'gallery_slot4_url', 'gallery_slot4_title'
        ],
        'show_hallen' => ['location_rooms'],
        'show_hilfe' => ['hilfe_status', 'hilfe_categories'],
        'show_logistik' => ['travel_radius', 'mobility_status', 'travel_expenses'],
        'show_network' => ['network'],
        'show_projects' => ['projects'],
        'show_reviews' => ['reviews'],
        'show_representation' => [
            'representation_type', 'agent_name', 'agent_email', 'agent_phone'
        ],
        'show_skills' => ['skills'],
        'show_certificates' => ['certificates'],
        'show_socials' => [
            'social_facebook', 'social_instagram', 'social_linkedin',
            'social_spotify', 'social_youtube'
        ]
    ];

    foreach ($fieldMap as $visibilityField => $privateFields) {
        if (($profile[$visibilityField] ?? null) === false) {
            foreach ($privateFields as $privateField) {
                unset($profile[$privateField]);
            }
        }
    }

    foreach ([
        'name_visible' => ['name', 'display_name'],
        'nachname_visible' => ['nachname', 'display_name'],
        'street_visible' => ['street', 'lat', 'lng'],
        'plz_visible' => ['plz', 'lat', 'lng'],
        'location_visible' => ['location', 'city', 'lat', 'lng']
    ] as $visibilityField => $privateFields) {
        if (($profile[$visibilityField] ?? null) === false) {
            foreach ($privateFields as $privateField) {
                unset($profile[$privateField]);
            }
        }
    }

    if (
        ($profile['show_stamm'] ?? null) === false ||
        ($profile['show_address'] ?? null) === false ||
        ($profile['show_street'] ?? null) === false ||
        ($profile['show_plz'] ?? null) === false ||
        ($profile['show_city'] ?? null) === false ||
        ($profile['street_visible'] ?? null) === false ||
        ($profile['plz_visible'] ?? null) === false ||
        ($profile['location_visible'] ?? null) === false
    ) {
        unset($profile['lat'], $profile['lng']);
    }

    foreach ($profile as $key => $_value) {
        if (strncmp($key, 'show_', 5) === 0 && ($profile[$key] ?? null) === false) {
            unset($profile[substr($key, 5)]);
        }
        if (
            substr($key, -8) === '_visible' &&
            ($profile[$key] ?? null) === false
        ) {
            unset($profile[substr($key, 0, -8)]);
        }
    }

    foreach ([
        'company_uid' => 'show_company_uid',
        'steuernummer' => 'show_steuernummer',
        'tax_id' => 'tax_id_visible',
        'bank_name' => 'bank_name_visible',
        'bank_iban' => 'bank_iban_visible',
        'bank_bic' => 'bank_bic_visible'
    ] as $sensitiveField => $visibilityField) {
        if (($profile[$visibilityField] ?? null) !== true) {
            unset($profile[$sensitiveField]);
        }
    }

    foreach (['facebook', 'instagram', 'linkedin', 'spotify', 'youtube'] as $network) {
        $visibilityField = "show_social_{$network}";
        if (($profile[$visibilityField] ?? null) === false) {
            unset($profile["social_{$network}"]);
        }
    }

    foreach (range(1, 4) as $slot) {
        if (($profile["gallery_slot{$slot}_visible"] ?? null) === false) {
            unset(
                $profile["gallery_slot{$slot}_url"],
                $profile["gallery_slot{$slot}_title"]
            );
        }
    }

    foreach (range(1, 4) as $slot) {
        foreach (['image', 'line1', 'line2'] as $field) {
            if (($profile["show_slide{$slot}_{$field}"] ?? null) === false) {
                if ($field === 'image') {
                    unset($profile["slide{$slot}_url"], $profile["slide{$slot}_media_url"]);
                } else {
                    unset($profile["slide{$slot}_{$field}"]);
                }
            }
        }
    }

    foreach (['equipment', 'compliance'] as $listField) {
        if (isset($profile[$listField]) && is_array($profile[$listField])) {
            $profile[$listField] = array_values(array_filter(
                $profile[$listField],
                static fn($item) => !is_array($item) || ($item['visible'] ?? true) !== false
            ));
        }
    }

    foreach ([
        'skills' => 'skills_visibility',
        'certificates' => 'certificate_visibility'
    ] as $listField => $visibilityField) {
        if (isset($profile[$listField]) && is_array($profile[$listField])) {
            $visibility = $profile[$visibilityField] ?? [];
            $profile[$listField] = array_values(array_filter(
                $profile[$listField],
                static fn($_item, $index) => !is_array($visibility)
                    || ($visibility[$index] ?? true) !== false,
                ARRAY_FILTER_USE_BOTH
            ));
        }
        unset($profile[$visibilityField]);
    }

    if (isset($profile['location_rooms']) && is_array($profile['location_rooms'])) {
        $profile['location_rooms'] = array_values(array_filter(
            $profile['location_rooms'],
            static fn($room) => !is_array($room) || ($room['visible'] ?? true) !== false
        ));
    }

    foreach ($profile as $key => $value) {
        if (preg_match('/^room(\d+)_visibility$/', (string) $key, $matches) === 1 && $value === false) {
            $roomPrefix = "room{$matches[1]}_";
            foreach (array_keys($profile) as $roomField) {
                if (strncmp((string) $roomField, $roomPrefix, strlen($roomPrefix)) === 0) {
                    unset($profile[$roomField]);
                }
            }
        }
    }

    if (isset($profile['hilfe_categories']) && is_array($profile['hilfe_categories'])) {
        foreach (['aufbau', 'flyer', 'logistik', 'abbau'] as $category) {
            if (($profile["show_hilfe_{$category}"] ?? null) === false) {
                unset($profile['hilfe_categories'][$category]);
            }
        }
    }

    if (isset($profile['documents']) && is_array($profile['documents'])) {
        $profile['documents'] = array_values(array_filter(
            $profile['documents'],
            static fn($document) => is_array($document)
                && ($document['security'] ?? 'public') === 'public'
        ));
    }

    return $profile;
}

function sanitizePublicProfileRow(array $row): array
{
    if (!isset($row['profile_json'])) {
        return $row;
    }

    $profile = json_decode((string) $row['profile_json'], true);
    if (!is_array($profile)) {
        error_log('Invalid profile_json while applying public profile visibility.');
        $profile = [];
    }

    $profile = stripPrivateProfileFields($profile);
    $row['profile_json'] = json_encode($profile);

    foreach (array_keys($row) as $key) {
        if (strncmp($key, 'show_', 5) === 0 && ($profile[$key] ?? null) === false) {
            unset($row[substr($key, 5)]);
        }
    }

    if (
        ($profile['show_stamm'] ?? null) === false ||
        ($profile['show_name'] ?? null) === false ||
        ($profile['show_name_real'] ?? null) === false ||
        ($profile['show_vorname'] ?? null) === false ||
        ($profile['show_nachname'] ?? null) === false ||
        ($profile['name_visible'] ?? null) === false ||
        ($profile['nachname_visible'] ?? null) === false ||
        ($profile['show_Klarname'] ?? null) === false
    ) {
        unset($row['name']);
    }
    if (
        ($profile['show_address'] ?? null) === false ||
        ($profile['show_city'] ?? null) === false ||
        ($profile['location_visible'] ?? null) === false ||
        ($profile['show_stamm'] ?? null) === false
    ) {
        unset($row['city']);
    }
    if (
        ($profile['show_address'] ?? null) === false ||
        ($profile['show_street'] ?? null) === false ||
        ($profile['street_visible'] ?? null) === false ||
        ($profile['show_stamm'] ?? null) === false
    ) {
        unset($row['street']);
    }
    if (
        ($profile['show_address'] ?? null) === false ||
        ($profile['show_plz'] ?? null) === false ||
        ($profile['plz_visible'] ?? null) === false ||
        ($profile['show_stamm'] ?? null) === false
    ) {
        unset($row['plz']);
    }
    if (
        ($profile['show_stamm'] ?? null) === false ||
        ($profile['show_address'] ?? null) === false ||
        ($profile['show_street'] ?? null) === false ||
        ($profile['show_plz'] ?? null) === false ||
        ($profile['show_city'] ?? null) === false
        || ($profile['location_visible'] ?? null) === false
        || ($profile['plz_visible'] ?? null) === false
        || ($profile['street_visible'] ?? null) === false
    ) {
        unset($row['lat'], $row['lng']);
    }
    if (($profile['show_bio'] ?? null) === false || ($profile['show_stamm'] ?? null) === false) {
        unset($row['bio']);
    }

    if (($profile['show_avatarUrl'] ?? null) === false || ($profile['show_stamm'] ?? null) === false) {
        $row['avatar_media_id'] = null;
    }

    return $row;
}
