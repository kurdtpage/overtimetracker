<?php

$notifys = array();

if (empty($_GET['userid']) || empty($_GET['role'])) {
	$notifys[] = array('error' => 'Missing info');
	echo json_encode($notifys);
	exit();
}

require_once 'inc/connect.php';

$stmt = $pdo->prepare('
	Select timeslot
	From notify
	Where
		role = :role And
		user = :user And
		timeslot >= CurDate() And
		timeslot < Date_Add(CurDate(), Interval 30 Day)
	Order by timeslot
');

$stmt->execute([
	'role' => $_GET['role'],
	'user' => $_GET['userid']
]);

while ($notify = $stmt->fetch()) {
	$notifys[] = $notify;
}

echo json_encode($notifys);
