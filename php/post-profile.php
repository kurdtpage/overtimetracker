<?php

session_start();

/**
 * Generates a passphrase consisting of some random words, followed by a number
 * @param {int} $words The number of words the passphrase will have, default is 4
 * @param {string} $separator The separator between words, usually a space
 */
function generatePassphrase($words = 4, $separator = ' ')
{
    // Load a list of words
    $wordList = file('wordlist.txt', FILE_IGNORE_NEW_LINES);

    // Select random words from the list
    $selectedWords = array_rand($wordList, $words);

    // Construct the passphrase
    $passphrase = '';
    foreach ($selectedWords as $index) {
        $passphrase .= $wordList[$index] . $separator;
    }

    $passphrase .= rand(1, 9);

    return $passphrase;
}

$response = [];
$response['ok'] = false;
$response['post'] = $_POST;
$response['session'] = $_SESSION;
$response['error'] = '';

if (empty($_POST['id'])) {
	$response['error'] = 'Missing data';
	echo json_encode($response);
	exit;
}

require_once 'inc/connect.php';

if ($_POST['id'] == 'insert') {
	//create new user
	$password = generatePassphrase();
	$sql = 'INSERT INTO user (
		fullname, email, role, password, active
	) VALUES (
		:fullname, :email, :role, :password, 1
	)';
	$data = [
		'fullname' => $_POST['fullname'],
		'email' => $_POST['email'],
		'role' => $_POST['role'],
		'password' => password_hash($password, PASSWORD_DEFAULT)
	];
	$response['password'] = $password;
	$response['sql'][] = replaceNamedPlaceholders($sql, $data);
	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);

	//TODO: email password to user
	$response['password_emailed'] = false;
} elseif (!empty($_POST['role'])) {
	//admin updating user
	$sql = 'UPDATE user SET
		role = :role
	WHERE id = :id';
	$data = [
		'role' => $_POST['role'],
		'id' => $_POST['id']
	];
	$response['sql'][] = replaceNamedPlaceholders($sql, $data);
	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);
} elseif (!empty($_POST['action']) && $_POST['action'] == 'delete') {
	//admin deleting user
	$sql = 'UPDATE user SET
		active = 0
	WHERE id = :id';
	$data = [
		'id' => $_POST['id']
	];
	$response['sql'][] = replaceNamedPlaceholders($sql, $data);
	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);
} else {
	//user updating their own profile
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
	$response['sql'][] = replaceNamedPlaceholders($sql, $data);
	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);

	if (!empty($_POST['password'])) {
		$sql = 'UPDATE user SET
			password = :password
		WHERE id = :id';
		$data = [
			'password' => password_hash($_POST['password'], PASSWORD_DEFAULT)
		];
		$response['sql'][] = replaceNamedPlaceholders($sql, $data);
		$stmt = $pdo->prepare($sql);
		$stmt->execute($data);
	}
}

$response['ok'] = true;
echo json_encode($response);
