<?php
// Initialize the session
session_start();

// Check if the user is already logged in, if yes then redirect him to welcome page
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
	header('location: index.html');
	exit;
}

// Include config file
require_once 'php/inc/connect.php';

// Define variables and initialize with empty values
$email = $password = '';
$email_err = $password_err = $login_err = '';

// Processing form data when form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	// Check if email is empty
	if (empty(trim($_POST['email']))) {
		$email_err = 'Please enter email.';
	} else {
		$email = trim($_POST['email']);
	}

	// Check if password is empty
	if (empty(trim($_POST['password']))) {
		$password_err = 'Please enter your password.';
	} else {
		$password = trim($_POST['password']);
	}

	// Validate credentials
	if (empty($email_err) && empty($password_err)) {
		// Prepare a select statement
		$sql = 'SELECT *
			FROM user
			WHERE email = :email';

		if ($stmt = $pdo->prepare($sql)) {
			// Bind variables to the prepared statement as parameters
			$stmt->bindParam(':email', $param_email, PDO::PARAM_STR);

			// Set parameters
			$param_email = trim($_POST['email']);

			// Attempt to execute the prepared statement
			if ($stmt->execute()) {
				// Check if email exists, if yes then verify password
				if ($stmt->rowCount() == 1) {
					if ($row = $stmt->fetch()) {
						$id = $row['id'];
						$email = $row['email'];
						$hashed_password = $row['password'];
						$fullname = $row['fullname'];
						$phone = $row['phone'];
						$role = $row['role'];
						$format = $row['format'];

						if (password_verify($password, $hashed_password)) {
							// Password is correct, so start a new session
							session_start();

							// Store data in session variables
							$_SESSION['loggedin'] = true;
							$_SESSION['userid'] = $id;
							$_SESSION['email'] = $email;
							$_SESSION['fullname'] = $fullname;
							$_SESSION['phone'] = $phone;
							$_SESSION['role'] = $role;
							$_SESSION['format'] = $format;

							setcookie('loggedin', true, time() + (86400 * 30), '/');
							setcookie('id', $id, time() + (86400 * 30), '/');
							setcookie('email', $email, time() + (86400 * 30), '/');
							setcookie('fullname', $fullname, time() + (86400 * 30), '/');
							setcookie('phone', $phone, time() + (86400 * 30), '/');
							setcookie('role', $role, time() + (86400 * 30), '/');
							setcookie('format', $format, time() + (86400 * 30), '/');

							// Redirect user to welcome page
							header('location: index.html');
						} else {
							// Password is not valid, display a generic error message
							$login_err = 'Invalid email or password.'; //password_hash($password, PASSWORD_DEFAULT);
						}
					}
				} else {
					// email doesn't exist, display a generic error message
					$login_err = 'Invalid email or password.';
				}
			} else {
				echo 'Oops! Something went wrong. Please try again later.';
			}

			// Close statement
			unset($stmt);
		}
	}

	// Close connection
	unset($pdo);
}
?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Overtime tracker</title>
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
			integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
		<link href="css/login.css" rel="stylesheet">
	</head>
	<body>
		<h1>Overtime tracker</h1>

		<div class="container">
			<div class="row vertical-center">
				<div class="col">	
					<form action="login.php" method="post">
						<div class="mb-3 row">
							<?php
								if (!empty($login_err)) {
									echo '<div class="alert alert-danger">' . $login_err . '</div>';
								}
							?>
						</div>
						<div class="mb-3 row">
							<label for="inputEmail" class="col-sm-3 col-form-label">Email</label>
							<div class="col-sm-9">
								<input type="email" name="email" class="form-control <?php echo (!empty($email_err)) ? 'is-invalid' : ''; ?>" value="<?php echo $email; ?>">
								<span class="invalid-feedback"><?php echo $email_err; ?></span>
							</div>
						</div>
						<div class="mb-3 row">
							<label for="inputPassword" class="col-sm-3 col-form-label">Password</label>
							<div class="col-sm-9">
								<input type="password" name="password" class="form-control <?php echo (!empty($password_err)) ? 'is-invalid' : ''; ?>">
								<span class="invalid-feedback"><?php echo $password_err; ?></span>
							</div>
						</div>
						<div class="mb-3 row text-center">
							<button type="submit" class="btn btn-primary">Login</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</body>
</html>