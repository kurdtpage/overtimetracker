<?php

/*
Inputs:
$_GET array
role - string (also contains spaces)
*/

$timeslots = array();

if (empty($_GET['role'])) {
	$timeslots[] = array(
		'error' => 'Missing info'
	);
	echo json_encode($timeslots);
	exit();
}

require_once 'inc/connect.php';

$stmt = $pdo->prepare('
	Select
		timeslot.id,
		timeslot.start_time,
		timeslot.end_time,
		area.area_name,
		timeslot.taken
	From
		timeslot Left Join
		area On area.id = timeslot.area Left Join
		role On role.id = timeslot.role
	Where
		timeslot.start_time > Now() And
		timeslot.start_time < Date_Add(CurDate(), Interval 30 Day) And
		role.id = :role And
		timeslot.taken = 0
	Order By
		timeslot.start_time,
		area.id
');

$stmt->execute([
	'role' => $_GET['role']
]);

while ($timeslot = $stmt->fetch()) {
	$timeslots[] = $timeslot;
}

echo json_encode($timeslots);
