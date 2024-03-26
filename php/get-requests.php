<?php

$timeslots = array();

require_once 'inc/connect.php';

$stmt = $pdo->query('
	Select
		request.id,
		area.area_name,
		role.role_name,
		timeslot.start_time,
		timeslot.end_time,
		requester.fullname As requester,
		approved.fullname As approved,
		timeslot.taken
	From
		request Left Join
		timeslot On timeslot.id = request.timeslot Left Join
		user requester On requester.id = request.user Left Join
		user approved On approved.id = request.approved_by Left Join
		role On role.id = timeslot.role Left Join
		area On area.id = timeslot.area
	Where
		timeslot.start_time >= CurDate() And
		timeslot.start_time < Date_Add(CurDate(), Interval 30 Day) And
		timeslot.taken = 0
	Order By
		timeslot.start_time
');

while ($timeslot = $stmt->fetch()) {
	$timeslots[] = $timeslot;
}

echo json_encode($timeslots);
