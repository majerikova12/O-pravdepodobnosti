<?php
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"]) && isset($_POST["id_priklad"]) && isset($_POST["vsetky_data"]) && isset($_POST["spravny_vysledok"])){
	if ($_POST["spravny_vysledok"]=="true"){$spravny = 1;}else{$spravny = 0;}
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result=mysqli_query($link, "SELECT count(*) AS pocet FROM priklady WHERE id_priklad = ".mysqli_real_escape_string($link,$_POST["id_priklad"])." AND id_pouzivatel = '".$_SESSION["pouzivatel"]["id"]."'")){
			if (mysqli_fetch_assoc($result)["pocet"] > 0){
				if ($result=mysqli_query($link, "UPDATE priklady SET vyriesene = ".$spravny.", data = '".mysqli_real_escape_string($link,$_POST["vsetky_data"])."' WHERE id_priklad = ".mysqli_real_escape_string($link,$_POST["id_priklad"])." AND id_pouzivatel = '".$_SESSION["pouzivatel"]["id"]."'")){
					echo("updated");
				} else {echo ("not updated");}
			}else{
				if ($result=mysqli_query($link, "INSERT INTO priklady SET vyriesene = ".$spravny.", id_priklad = ".mysqli_real_escape_string($link,$_POST["id_priklad"]).",id_pouzivatel = '".$_SESSION["pouzivatel"]["id"]."',data = '".mysqli_real_escape_string($link,$_POST["vsetky_data"])."'")){
					echo("ulozene");
				} else {echo ("not saved");}
			}
		}
	}	
}else{
	echo "nie si prihlaseny";
}
?>