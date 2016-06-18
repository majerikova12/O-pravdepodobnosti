<?php
session_start();
header('Content-Type: text/plain');
if (!isset($_SESSION["pouzivatel"])){
	echo("si odhlaseny");
}
?>