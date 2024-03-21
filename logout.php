<?php
// Initialize the session
session_start();

// Unset all of the session variables
$_SESSION = array();
setcookie('loggedin', false, time() + (86400 * 30), '/');
setcookie('id', '', time() + (86400 * 30), '/');
setcookie('email', '', time() + (86400 * 30), '/');
setcookie('fullname', '', time() + (86400 * 30), '/');
setcookie('phone', '', time() + (86400 * 30), '/');
setcookie('role', '', time() + (86400 * 30), '/');
setcookie('format', '', time() + (86400 * 30), '/');

// Destroy the session.
session_destroy();

// Redirect to login page
header('location: login.php');
exit;
