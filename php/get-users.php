<?php

$names = array();

require_once 'inc/connect.php';

$stmt = $pdo->query('
	Select
		user.id,
		user.fullname,
		user.email,
		user.role,
		user.active,
		role.role_name
	From
		user Left Join
		role On role.id = user.role
	Order By
		user.active desc,
		user.fullname,
		user.id
');

while ($name = $stmt->fetch()) {
	$names[] = $name;
}

echo json_encode($names);
