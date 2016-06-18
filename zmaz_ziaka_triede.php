<?php 
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"]) && isset($_POST["id_trieda"])){
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result = mysqli_query($link,"DELETE FROM ziaci WHERE id_trieda = ".mysqli_real_escape_string($link,$_POST["id_trieda"])." AND id_pouzivatel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."'")){
			echo "Ziak je zmazany.";
		}else{
			echo "Database error.";
		}
	}
}

?>