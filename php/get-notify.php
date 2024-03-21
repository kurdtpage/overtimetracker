<?php

$notifys = array();

if (empty($_GET['userid']) || empty($_GET['role'])) {
	$notifys[] = array(
		'error' => 'Missing info'
	);
	echo json_encode($notifys);
	exit();
}

require_once 'inc/connect.php';

$stmt = $pdo->prepare('
	Select
		timeslot.id,
		timeslot.start_time,
		timeslot.role
	From
		notify Left Join
		timeslot On timeslot.id = notify.timeslot
	Where
		timeslot.role = :role And
		notify.user = :user
');

$stmt->execute([
	'role' => $_GET['role'],
	'user' => $_GET['userid']
]);

while ($notify = $stmt->fetch()) {
	$notifys[] = $notify;
}

echo json_encode($notifys);
