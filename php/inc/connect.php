<?php
/**
 * Prints out nice SQL
 * @param {string} $sql The SQL query, this will have named placeholders prefaced with a colon
 * @param {array} $data The data that goes in the placeholders of the string
 * @returns Nice SQL string
 */
function replaceNamedPlaceholders($sql, $data)
{
    // Loop through each key-value pair in the data array
    foreach ($data as $key => $value) {
        // Create a placeholder string to match named placeholders in the SQL
        $placeholder = ':' . $key;
        // Replace the named placeholder with the corresponding value in the SQL string
        $sql = str_replace($placeholder, '"' . $value . '"', $sql);
    }
    // Return the modified SQL string
    return $sql;
}

require_once 'credentials.php';

$dsn = "mysql:host=$hostname;dbname=$database;charset=$char_set";
$options = [
	PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	PDO::ATTR_EMULATE_PREPARES   => false,
];
$pdo = new PDO($dsn, $username, $password, $options);
