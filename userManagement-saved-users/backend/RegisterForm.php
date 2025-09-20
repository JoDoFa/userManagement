<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection
$host = "localhost";
$user = "root";   // change if needed
$pass = "";       // change if needed
$db   = "users_db"; // change to your DB name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "DB Connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"] ?? "";
$email    = $data["email"] ?? "";
$password = $data["password"] ?? "";

// Basic validation
if (!$username || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

// Check if email exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered"]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to register user"]);
}

$conn->close();
?>
