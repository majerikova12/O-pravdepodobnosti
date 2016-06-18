<?php 
session_start();
header('Content-Type: text/plain');
if (isset($_POST["nazov_triedy"]) && isset($_SESSION["pouzivatel"])){
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result=mysqli_query($link,"SELECT * FROM triedy WHERE nazov = '".mysqli_real_escape_string($link,$_POST["nazov_triedy"])."'")){
			if (mysqli_num_rows($result) == 0){
				if (mysqli_query($link,"INSERT INTO triedy SET nazov = '".mysqli_real_escape_string($link,$_POST["nazov_triedy"])."', id_majitel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."'")){
					echo "Trieda vytvorena.";
				} else{
					echo "Database error.";
				}
			} else {
				echo "Nazov je obsadeny.";
			}
		}
	}
}

?>