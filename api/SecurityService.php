<?php

require_once 'db.php';

class SecurityService
{

    public static function canRegister($ip)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT COUNT(*)
            FROM registration_attempts
            WHERE ip_address = :ip
            AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
            AND success = 1
        ");

        $stmt->execute([
            ':ip' => $ip
        ]);

        $hourCount = (int)$stmt->fetchColumn();

        if ($hourCount >= 3)
        {
            return false;
        }

        $stmt = $pdo->prepare("
            SELECT COUNT(*)
            FROM registration_attempts
            WHERE ip_address = :ip
            AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
            AND success = 1
        ");

        $stmt->execute([
            ':ip' => $ip
        ]);

        $dayCount = (int)$stmt->fetchColumn();

        if ($dayCount >= 10)
        {
            return false;
        }

        return true;
    }

    public static function recordRegistration(
        $ip,
        $email,
        $success
    )
    {
        global $pdo;

        $stmt = $pdo->prepare("
            INSERT INTO registration_attempts
            (
                ip_address,
                email,
                success
            )
            VALUES
            (
                :ip,
                :email,
                :success
            )
        ");

        $stmt->execute([
            ':ip' => $ip,
            ':email' => $email,
            ':success' => $success ? 1 : 0
        ]);
    }



    public static function getClientIp()
    {
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }

    public static function isIpLocked($ip)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT *
            FROM security_locks
            WHERE lock_type = 'ip'
            AND lock_key = :lock_key
            AND expires_at > NOW()
            LIMIT 1
        ");

        $stmt->execute([
            ':lock_key' => $ip
        ]);

        return !!$stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function isAccountLocked($email)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT *
            FROM security_locks
            WHERE lock_type = 'account'
            AND lock_key = :lock_key
            AND expires_at > NOW()
            LIMIT 1
        ");

        $stmt->execute([
            ':lock_key' => $email
        ]);

        return !!$stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function recordLoginAttempt(
        $email,
        $ip,
        $success
    )
    {
        global $pdo;

        $stmt = $pdo->prepare("
            INSERT INTO login_attempts
            (
                email,
                ip_address,
                success
            )
            VALUES
            (
                :email,
                :ip,
                :success
            )
        ");

        $stmt->execute([
            ':email' => $email,
            ':ip' => $ip,
            ':success' => $success ? 1 : 0
        ]);
    }

    public static function createLock(
        $type,
        $key,
        $minutes
    )
    {
        global $pdo;

        $stmt = $pdo->prepare("
            INSERT INTO security_locks
            (
                lock_type,
                lock_key,
                expires_at
            )
            VALUES
            (
                :type,
                :lock_key,
                DATE_ADD(NOW(), INTERVAL :minutes MINUTE)
            )
        ");

        $stmt->execute([
            ':type' => $type,
            ':lock_key' => $key,
            ':minutes' => $minutes
        ]);
    }

public static function evaluateLocks(
    $email,
    $ip
)
{
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT COUNT(*) c
        FROM login_attempts
        WHERE email = :email
        AND success = 0
        AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ");

    $stmt->execute([
        ':email' => $email
    ]);

    $emailFails = (int)$stmt->fetchColumn();

    if ($emailFails >= 50)
    {
        self::createLock(
            'account',
            $email,
            10080
        );
    }
    elseif ($emailFails >= 20)
    {
        self::createLock(
            'account',
            $email,
            1440
        );
    }
    elseif ($emailFails >= 10)
    {
        self::createLock(
            'account',
            $email,
            60
        );
    }
    elseif ($emailFails >= 5)
    {
        self::createLock(
            'account',
            $email,
            15
        );
    }

    $stmt = $pdo->prepare("
        SELECT COUNT(*) c
        FROM login_attempts
        WHERE ip_address = :ip
        AND success = 0
        AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
    ");

    $stmt->execute([
        ':ip' => $ip
    ]);

    $ipFails = (int)$stmt->fetchColumn();

        if ($ipFails >= 20)
        {
            self::createLock(
                'ip',
                $ip,
                15
            );
        }
    }
}