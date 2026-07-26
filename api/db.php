<?php

$host = "mysqlsvr88.world4you.com";
$db   = "8678591db1";
$user = "sql9872333";
$pass = "w40+70n4";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $e) {

    die(json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]));
}