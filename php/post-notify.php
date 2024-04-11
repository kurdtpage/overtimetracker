<?php

$response = [
	'ok' => false,
	'post' => $_POST,
	'cookie' => $_COOKIE,
	'error' => ''
];

if (empty($_POST['id']) || empty($_POST['state']) || !stristr($_POST['id'], '-')) {
	echo 'Missing data';
	exit;
}

if ($_COOKIE['role'] === '0') {
	require_once 'inc/connect.php';

	/*
	╔╡notify╞═════╤════╤════╤═══════════════════════╗
	║id│timeslot  │user│role│requested_time         ║
	╟──┼──────────┼────┼────┼───────────────────────╢
	║ 1│2024-03-26│   1│   1│2024-03-22 17:16:43.000║
	║ 2│2024-03-27│   1│   2│2024-03-22 17:16:44.000║
	║ 3│2024-03-28│   2│   1│2024-03-22 17:16:45.000║
	║ 4│2024-03-29│   2│   2│2024-03-22 17:16:46.000║
	║ 5│2024-03-30│   1│   1│2024-03-22 17:16:47.000║
	║ 6│2024-03-31│   1│   2│2024-03-22 17:16:48.000║
	║ 7│2024-03-31│   2│   2│2024-03-22 17:16:49.000║
	╚══╧══════════╧════╧════╧═══════════════════════╝
	*/

	//id is like this: notify-1-2024-03-27 (1 is the role)

	$state = $_POST['state'];
	$bigid = explode('-', $_POST['id']);
	$role = $bigid[1];
	$timeslot = $bigid[2] . '-' . $bigid[3] . '-' . $bigid[4];
	//           year              month             day
	$user = $_COOKIE['userid'];

	//get the timeslot id, this is to see if it exists or not
	$sql = 'Select id
		From notify
		WHERE 
			timeslot = :timeslot And
			user = :user And
			role = :role
	';
	$data = [
		'timeslot' => $timeslot,
		'user' => $user,
		'role' => $role
	];
	$response['sql'][] = replaceNamedPlaceholders($sql, $data);

	$stmt = $pdo->prepare($sql);
	$stmt->execute($data);
	$notify = $stmt->fetch();

	if ($notify) {
		//exists
		if ($state == 'false') {
			//untick box, delete record
			$sql = 'DELETE FROM notify
				WHERE
					timeslot = :timeslot And
					user = :user And
					role = :role
			';
			$data = [
				'timeslot' => $timeslot,
				'user' => $user,
				'role' => $role
			];
			$response['sql'][] = replaceNamedPlaceholders($sql, $data);
			$stmt = $pdo->prepare($sql);
			$stmt->execute($data);
		}
	} else {
		//does not exist
		if ($state == 'true') {
			//box is unticked, want it ticked. create record
			$sql = 'INSERT INTO notify (
				timeslot, user, role
			) VALUES (
				:timeslot, :user, :role
			)';
			$data = [
				'timeslot' => $timeslot,
				'user' => $user,
				'role' => $role
			];
			$output['sql'][] = replaceNamedPlaceholders($sql, $data);
			$stmt = $pdo->prepare($sql);
			$stmt->execute($data);
		}
	}

	$response['ok'] = true;
} else {
	$response['error'] = 'You are not an admin';
}

echo json_encode($response);
