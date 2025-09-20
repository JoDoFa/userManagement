<?php
// backend/users.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbName = "user_management_db"; // use the user's existing database named 'user'
// ✅ Connect to DB
$dsn = "mysql:host=localhost;dbname={$dbName};charset=utf8mb4";
$user = "root"; // change if needed
$pass = "";     // change if needed

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    // If DB doesn't exist yet, try to create it and the users table automatically
    $msg = $e->getMessage();
    if (stripos($msg, 'Unknown database') !== false || stripos($msg, '1049') !== false) {
        try {
            // connect without database
            $tmp = new PDO("mysql:host=localhost", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            // create database and table
            $tmp->exec("CREATE DATABASE IF NOT EXISTS user_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $tmp->exec("USE user_management_db;");
            $tmp->exec("CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                status ENUM('active','inactive') NOT NULL DEFAULT 'active',
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY uniq_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
            // reconnect to the newly created DB
            $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        } catch (PDOException $e2) {
            http_response_code(500);
            echo json_encode(["error" => "DB creation failed", "detail" => $e2->getMessage()]);
            exit;
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => "DB Connection failed", "detail" => $msg]);
        exit;
    }
}

// ✅ Get request method
$method = $_SERVER['REQUEST_METHOD'];

// ✅ GET all or single user
if ($method === "GET") {
    if (isset($_GET['id'])) {
        // alias created_at to createdAt for frontend compatibility
        $stmt = $pdo->prepare("SELECT id, username, email, status, created_at AS createdAt FROM users WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $stmt = $pdo->query("SELECT id, username, email, status, created_at AS createdAt FROM users ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    exit;
}

// ✅ POST create user
if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data['username'], $data['email'], $data['status'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }
    // insert into created_at column (your DB uses created_at)
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, status, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$data['username'], $data['email'], $data['status']]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Insert failed", "detail" => $e->getMessage()]);
    }
    exit;
}

// ✅ PUT update user
if ($method === "PUT") {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing user ID"]);
        exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    try {
        $stmt = $pdo->prepare("UPDATE users SET username=?, email=?, status=? WHERE id=?");
        $stmt->execute([$data['username'], $data['email'], $data['status'], $_GET['id']]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Update failed", "detail" => $e->getMessage()]);
    }
    exit;
}

// ✅ DELETE user
if ($method === "DELETE") {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing user ID"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
        $stmt->execute([$_GET['id']]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Delete failed", "detail" => $e->getMessage()]);
    }
    exit;
}
