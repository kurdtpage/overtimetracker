<?php

session_start();

$output = array();

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] != true) {
	header('location: ../logout.php');
	exit;
}

if (empty($_POST['id']) || empty($_POST['state'])) {
	echo 'id or state is empty';
	//print_r($_POST);
	exit;
}

require_once 'inc/connect.php';

/*
╔══════════╗   ╔════════════╗
║ notify   ║   ║ timeslot   ║
╟──────────╢   ╟────────────╢
║ id       ║ ┌►╢ id         ║
║ timeslot ╟─┘ ║ start_time ║
║ user     ║   ║ role       ║
╚══════════╝   ╚════════════╝
*/

//id is like this: notify-1-2024-03-27 (1 is the role)

$state = $_POST['state'];
$bigid = explode('-', $_POST['id']);
$role = $bigid[1];
$startdate = $bigid[2] . '-' . $bigid[3] . '-' . $bigid[4];

//get the timeslot id, this is to see if it exists or not
$sql = 'Select 
		notify.id
	From 
		notify Left Join 
		timeslot On timeslot.id = notify.timeslot
	WHERE 
		notify.user = :user And
		timeslot.role = :role And
		timeslot.start_time like :startdate';
$data = [
	'user' => $_SESSION['userid'],
	'role' => $role,
	'startdate' => $startdate . '%'
];
$modifiedSql = replaceNamedPlaceholders($sql, $data);
$output[53] = $modifiedSql;

$stmt = $pdo->prepare($sql);
$stmt->execute($data);
$notify = $stmt->fetch();

if ($notify) {
    //exists
	if ($state == 'false') {
		//untick box, delete record
		$sql = 'DELETE FROM notify
			WHERE timeslot = :timeslot AND user = :user';
		$data = [
			'timeslot' => $notify['id'],
			'user' => $_SESSION['userid']
		];
		$modifiedSql = replaceNamedPlaceholders($sql, $data);
		$output[70] = $modifiedSql;
		$stmt = $pdo->prepare($sql);
		$stmt->execute($data);
	} else {
		$output[74] = ' ';
	}
} else {
    //does not exist
	if ($state == 'true') {
		//box is unticked, want it ticked. create record
		//get timeslot record
		$sql = 'SELECT id
			FROM timeslot
			WHERE
				start_time like :startdate And
				role = :role';
		$data = [
			'startdate' => $startdate . '%',
			'role' => $role
		];
		$modifiedSql = replaceNamedPlaceholders($sql, $data);
		$output[91] = $modifiedSql;
		$stmt = $pdo->prepare($sql);
		$stmt->execute($data);
		$timeslot = $stmt->fetch();

		//insert into notify
		$sql = 'INSERT INTO notify (
			timeslot, user
		) VALUES (
			:timeslot, :user
		)';
		$data = [
			'timeslot' => $timeslot['id'],
			'user' => $_SESSION['userid']
		];
		$modifiedSql = replaceNamedPlaceholders($sql, $data);
		$output[107] = $modifiedSql;
		$stmt = $pdo->prepare($sql);
		$stmt->execute($data);
	} else {
		$output[111] = ' ';
	}
}

print_r($output);
