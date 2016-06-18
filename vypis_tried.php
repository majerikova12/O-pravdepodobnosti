<?php 
session_start();
header('Content-Type: text/plain');
if (isset($_SESSION["pouzivatel"])){
	if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
		if ($result = mysqli_query($link,"SELECT * FROM triedy INNER JOIN pouzivatelia ON triedy.id_majitel = pouzivatelia.id_pouzivatel")){
			$triedy = array();
			while ($row=mysqli_fetch_assoc($result)){
				array_push($triedy, $row);
			}
			echo json_encode(array("my_id"=>$_SESSION["pouzivatel"]["id"],"triedy"=>$triedy));
		}
	}
}

?>