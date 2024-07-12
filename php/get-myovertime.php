<?php

$timeslots = array();

if (empty($_GET['userid'])) {
	$timeslots[] = array(
		'error' => 'Missing info'
	);
	echo json_encode($timeslots);
	exit();
}

require_once 'inc/connect.php';

$stmt = $pdo->prepare('SELECT
	timeslot.id,
	timeslot.start_time,
	timeslot.end_time,
	role.role_name,
	area.area_name
From
	timeslot Left Join
	area On area.id = timeslot.area Left Join
	role On role.id = timeslot.role
Where
	timeslot.taken = :userid And
	timeslot.start_time >= CurDate() And
	timeslot.start_time <= Date_Add(CurDate(), Interval 30 Day)
Order by
	timeslot.start_time,
	role.id,
	area.id
');

$stmt->execute([
	'userid' => $_GET['userid']
]);

while ($timeslot = $stmt->fetch()) {
	$timeslots[] = $timeslot;
}

echo json_encode($timeslots);
