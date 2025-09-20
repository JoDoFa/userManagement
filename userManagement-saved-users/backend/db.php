<?php
// backend/db.php
// Update DB credentials as needed
$DB_HOST = 'localhost';
$DB_NAME = 'user'; // change if you used a different DB name
$DB_USER = 'root';
$DB_PASS = ''; // set your password

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
    exit;
}
