<?php

$areas = array();

require_once 'inc/connect.php';

$stmt = $pdo->query('SELECT id, area_name
	From area
	Where active = 1
	Order by id
');

while ($area = $stmt->fetch()) {
	$areas[] = $area;
}

echo json_encode($areas);
