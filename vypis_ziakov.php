<?php 
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"]) && isset($_POST["id_trieda"])){
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result = mysqli_query($link,"SELECT * FROM ziaci INNER JOIN pouzivatelia ON ziaci.id_pouzivatel = pouzivatelia.id_pouzivatel WHERE ziaci.id_trieda = ".mysqli_real_escape_string($link,$_POST["id_trieda"]))){
			$ziaci = array();
			$je_v_zozname = false;
			while ($row=mysqli_fetch_assoc($result)){
				$result2 = mysqli_query($link, "SELECT id_priklad FROM priklady WHERE id_pouzivatel = '".mysqli_real_escape_string($link,$row["id_pouzivatel"])."' AND vyriesene = 1");
				$row["vyriesene"] = array();
				while ($row2=mysqli_fetch_assoc($result2)){
					array_push($row["vyriesene"],$row2["id_priklad"]);
				}
				if ($row["id_pouzivatel"] == $_SESSION["pouzivatel"]["id"]){
					$je_v_zozname = true;
				}
				array_push($ziaci, $row);
			}
			$uzivatel = $_SESSION["pouzivatel"]["id"];
			echo json_encode(array("ziaci"=>$ziaci,"je_v_zozname"=>$je_v_zozname,"uzivatel"=>$uzivatel));
		}
	}
}

?>