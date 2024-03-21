<?php

$roles = array();

require_once 'inc/connect.php';

$stmt = $pdo->query('
	Select id, role_name
	From role
	where
		id > 0 And
		active = 1
	Order by id
');

while ($role = $stmt->fetch()) {
	$roles[] = $role;
}

echo json_encode($roles);
