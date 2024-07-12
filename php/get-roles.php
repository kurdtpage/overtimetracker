<?php

$roles = array();

require_once 'inc/connect.php';

$stmt = $pdo->query('SELECT id, role_name
	From role
	where active = 1
	Order by id
');

while ($role = $stmt->fetch()) {
	$roles[] = $role;
}

echo json_encode($roles);
