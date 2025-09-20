<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbName = "user_management_db"; // use the existing database named 'user'
$dsn = "mysql:host=localhost;dbname={$dbName};charset=utf8mb4";
$user = "root";
$pass = "";

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB Connection failed"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['username'], $data['email'], $data['status'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, status, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$data['username'], $data['email'], $data['status']]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
