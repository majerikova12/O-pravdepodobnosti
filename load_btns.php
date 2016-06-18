<?php
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"]) && isset($_POST["id_priklad"])){
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result=mysqli_query($link, "SELECT * FROM priklady WHERE id_priklad = ".mysqli_real_escape_string($link,$_POST["id_priklad"])." AND id_pouzivatel = '".$_SESSION["pouzivatel"]["id"]."'")){
			if (mysqli_num_rows($result) > 0){
				$row=mysqli_fetch_assoc($result);
				echo(json_encode(["data"=>$row["data"],"spravny_vysledok"=>$row['vyriesene']]));
			}
		}
	}
}else{
	echo "nie si prihlaseny";
}
?>