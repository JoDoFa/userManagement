<?php
// setup_db.php - run once to create DB and users table (from project root: php backend/setup_db.php)
try {
    $pdo = new PDO('mysql:host=127.0.0.1', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "Database ensured.\n";

    $pdo->exec("USE user;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status ENUM('active','inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uniq_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    echo "Table ensured.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

?>
