<?php 
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"]) && isset($_POST["id_trieda"])){
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result=mysqli_query($link,"SELECT * FROM triedy WHERE id_trieda = '".mysqli_real_escape_string($link,$_POST["id_trieda"])."' AND id_majitel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."'")){
			if (mysqli_num_rows($result) == 1){
				if ($result = mysqli_query($link,"DELETE FROM triedy WHERE id_trieda = ".mysqli_real_escape_string($link,$_POST["id_trieda"])." AND id_majitel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."'")){
					echo "Trieda je zmazana.";
					mysqli_query($link,"DELETE FROM ziaci WHERE id_trieda = ".mysqli_real_escape_string($link,$_POST["id_trieda"]));
				}else{
					echo "Database error.";
				}
			}
		}	
	}
}

?>