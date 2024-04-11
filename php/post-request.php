<?php

$response = [
	'ok' => false,
	'post' => $_POST,
	'cookie' => $_COOKIE,
	'error' => ''
];

if ((empty($_POST['userid']) || empty($_POST['timeslot'])) && empty($_POST['requestid'])) {
	$response['error'] = 'Missing data';
	echo json_encode($response);
	exit;
}

require_once 'inc/connect.php';

if (isset($_POST['requestid'])) {
	$sql = 'UPDATE request
		SET approved_by = :userid
		WHERE id = :requestid
	)';
	$data = [
		'userid' => $_COOKIE['userid'],
		'requestid' => $_POST['requestid']
	];
} else {
	$sql = 'INSERT INTO request (
		timeslot, user, approved_by
	) VALUES (
		:timeslot, :userid, null
	)'; //dont use 0 for approved_by, because that is the admin account
	$data = [
		'timeslot' => $_POST['timeslot'],
		'userid' => $_POST['userid']
	];
}

$response['sql'] = replaceNamedPlaceholders($sql, $data);
$stmt = $pdo->prepare($sql);
$stmt->execute($data);

$response['ok'] = true;
echo json_encode($response);
