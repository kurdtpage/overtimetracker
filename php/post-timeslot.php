<?php

$response = [
	'ok' => false,
	'post' => $_POST,
	'cookie' => $_COOKIE,
	'error' => ''
];

/*
	role
	area
	starttime
	endtime
	format
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

	/*
	JS: https://api.jqueryui.com/datepicker/
	PHP: https://www.php.net/manual/en/datetime.format.php
									JS	PHP
	day of month (no leading zero)	d	j
	day of month (two digit)		dd	d
	day name short					D	D
	day name long					DD	l
	month of year (no leading zero)	m	n
	month of year (two digit)		mm	m
	month name short				M	M
	month name long					MM	F
	year (two digit)				y	y
	year (four digit)				yy	Y
	*/

	switch ($_POST['format']) {
		case 'm/d/yy':
			$format = 'n/j/Y H:i';
			break;
		case 'd/m/yy':
			$format = 'j/n/Y H:i';
			break;
		case 'yy-mm-dd':
			$format = 'Y-m-d H:i';
			break;
		case 'DD M d, yy':
			$format = 'l M j, Y H:i';
			break;
		default: //DD d M, yy
			$format = 'l j M, Y H:i';
	}

	$dateTimeStart = DateTime::createFromFormat($format, $_POST['starttime']);
	$dateTimeEnd   = DateTime::createFromFormat($format, $_POST['endtime']);

	$sql = 'INSERT INTO timeslot (`area`, `role`, `start_time`, `end_time`, `taken`) 
		VALUES (:area, :role, :start_time, :end_time, 0)';
	$data = [
		'area' => $_POST['area'],
		'role' => $_POST['role'],
		'start_time' => $dateTimeStart->format('Y-m-d H:i:s'),
		'end_time' => $dateTimeEnd->format('Y-m-d H:i:s')
	];
	$response['sql'] = replaceNamedPlaceholders($sql, $data);
	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);

	$response['ok'] = true;
} else {
	$response['error'] = 'You are not an admin';
}

echo json_encode($response);
