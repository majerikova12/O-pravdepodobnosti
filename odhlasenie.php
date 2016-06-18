<?php
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"])){
	unset($_SESSION["pouzivatel"]);
	echo("podarilo sa odhlasit");
} else{
	echo("si odhlaseny");
}
?>