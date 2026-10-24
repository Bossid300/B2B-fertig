<?php

header('Content-Type: application/json');

session_start();

if (
    empty($_SESSION['profile_id']) ||
    empty($_SESSION['auth_user_id']) ||
    empty($_SESSION['login_time'])
) {
    echo json_encode([
        'logged_in' => false
    ]);
    exit;
}

echo json_encode([
    'logged_in' => true,
    'session_id' => session_id(),
    'profile_id' => $_SESSION['profile_id'],
    'auth_user_id' => $_SESSION['auth_user_id'],
    'login_time' => $_SESSION['login_time']
]);
