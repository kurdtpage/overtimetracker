<?php

session_start();

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
	header('location: ../logout.php');
	exit;
}

if (empty($_POST['id'])) {
	print_r($_POST);
	exit;
}

require_once 'inc/connect.php';

$sql = 'UPDATE user SET
	fullname = :fullname,
	email = :email,
	phone = :phone,
	format = :format
WHERE id = :id';
$data = [
	'fullname' => $_POST['fullname'],
	'email' => $_POST['email'],
	'phone' => $_POST['phone'],
	'format' => $_POST['format'],
	'id' => $_POST['id']
];
$modifiedSql = replaceNamedPlaceholders($sql, $data);
$stmt = $pdo->prepare($sql);
$stmt->execute($data);

if (!empty($_POST['password'])) {
	$sql = 'UPDATE user SET
		password = :password
	WHERE id = :id';
	$data = [
		'password' => password_hash($_POST['password'], PASSWORD_DEFAULT)
	];
	$modifiedSql .= ' ' . replaceNamedPlaceholders($sql, $data);
	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);
}

echo 'ok ' . $modifiedSql;
