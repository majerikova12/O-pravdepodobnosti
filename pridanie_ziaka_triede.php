<?php 
session_start();
header('Content-Type: text/plain');
if (isset($_POST["id_trieda"]) && isset($_SESSION["pouzivatel"])){
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result=mysqli_query($link,"SELECT * FROM ziaci WHERE id_trieda = ".mysqli_real_escape_string($link,$_POST["id_trieda"])." AND id_pouzivatel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."'")){
			if (mysqli_num_rows($result) == 0){
				if (mysqli_query($link,"INSERT INTO ziaci SET id_trieda = ".mysqli_real_escape_string($link,$_POST["id_trieda"]).", id_pouzivatel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."'")){
					echo "Ziak pridany.";
				} else{
					echo "Database error.";
				}
			} else {
				echo "Ziak je uz v triede.";
			}
		}
	}
}

?>