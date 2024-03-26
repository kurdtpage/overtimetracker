<?php
// Initialize the session
session_start();

// Unset all of the session variables
$_SESSION = array();
setcookie('loggedin', false);
setcookie('id', '');
setcookie('email', '');
setcookie('fullname', '');
setcookie('phone', '');
setcookie('role', '');
setcookie('format', '');

// Destroy the session.
session_destroy();

// Redirect to login page
header('location: login.php');
