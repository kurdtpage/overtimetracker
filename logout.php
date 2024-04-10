<?php

unset($_COOKIE['loggedin']);
unset($_COOKIE['userid']);
unset($_COOKIE['email']);
unset($_COOKIE['fullname']);
unset($_COOKIE['phone']);
unset($_COOKIE['role']);
unset($_COOKIE['role_name']);
unset($_COOKIE['format']);

setcookie('loggedin', '', -1);
setcookie('userid', '', -1);
setcookie('email', '', -1);
setcookie('fullname', '', -1);
setcookie('phone', '', -1);
setcookie('role', '', -1);
setcookie('role_name', '', -1);
setcookie('format', '', -1);

// Redirect to login page
header('location: login.php');
