<?php

$timeslots = array();

require_once 'inc/connect.php';

$stmt = $pdo->query('
	Select
		timeslot.id,
		role.role_name,
		area.area_name,
		timeslot.start_time,
		timeslot.end_time,
		user.fullname
	From
		timeslot Left Join
		area On area.id = timeslot.area Left Join
		role On role.id = timeslot.role Right Join
		user On user.id = timeslot.taken
	Where
		timeslot.taken <> 0 And
		timeslot.start_time >= CurDate() And
		timeslot.start_time < Date_Add(CurDate(), Interval 30 Day)
	Order by
		timeslot.start_time,
		role.id,
		area.id
');

while ($timeslot = $stmt->fetch()) {
	$timeslots[] = $timeslot;
}

echo json_encode($timeslots);
