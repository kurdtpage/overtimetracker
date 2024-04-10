<?php

$response = [];
$response['ok'] = false;
$response['post'] = $_POST;
$response['cookie'] = $_COOKIE;
$response['error'] = '';

/*
	role
	area
	starttime
	endtime
*/

if (empty($_POST['role']) || empty($_POST['area']) || empty($_POST['starttime']) || empty($_POST['endtime'])) {
	$response['error'] = 'Missing data';
	echo json_encode($response);
	exit;
}

if ($_COOKIE['role'] === '0') {
	require_once 'inc/connect.php';

	/*
	`id`          int unsigned NOT NULL AUTO_INCREMENT,
	`area`        int unsigned NOT NULL COMMENT '1=NECC, 2=CECC, 3=SECC',
	`role`        int unsigned NOT NULL COMMENT '1=Dispatcher, 2=Call taker',
	`taken`       int unsigned NOT NULL DEFAULT 0 COMMENT 'The user ID',
	`start_time`  datetime     NOT NULL,
	`end_time`    datetime     NOT NULL,
	*/

	$sql = 'INSERT INTO timeslot (`area`, `role`, `start_time`, `end_time`, `taken`) 
		VALUES (:area, :role, :start_time, :end_time, 0)';
	$data = [
		'area' => $_POST['area'],
		'role' => $_POST['role'],
		'start_time' => date('Y-m-d H:i:s', strtotime(str_replace('/', '-', $_POST['starttime']))),
		'end_time' => date('Y-m-d H:i:s', strtotime(str_replace('/', '-', $_POST['endtime'])))
	];
	$response['modifiedSql'] = replaceNamedPlaceholders($sql, $data);
	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);

	$response['ok'] = true;
} else {
	$response['error'] = 'You are not an admin';
}

echo json_encode($response);
