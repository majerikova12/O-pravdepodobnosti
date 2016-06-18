<?php
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"])){
	echo(json_encode(array(
		"meno" => $_SESSION["pouzivatel"]["meno"],
		"priezvisko" => $_SESSION["pouzivatel"]["priezvisko"]
	)));
}
?>