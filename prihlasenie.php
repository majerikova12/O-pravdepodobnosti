<?php 
session_start();
header('Content-Type: text/plain');
if (!isset($_SESSION["pouzivatel"]) && isset($_POST["id_token"])){
	$url = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
	$data = array('id_token' => $_POST['id_token']);
	$options = array(
    	'http' => array(
        	'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        	'method'  => 'POST',
        	'content' => http_build_query($data),
    	),
	);
	$context  = stream_context_create($options);
	$result = json_decode(file_get_contents($url, false, $context),true);
	if ($result && $result["aud"]=="343413004275-mv8l0atmp7s1j4ufroq4clh37g08bjvd.apps.googleusercontent.com"){
		$_SESSION["pouzivatel"] = array(
			"meno" => $result["given_name"], 
			"priezvisko" => $result["family_name"],
			"id" => $result["sub"] 
		);
		if($link = mysqli_connect('localhost', 'pravdepodobnost', 'MontyHallProblem', 'pravdepodobnost')) {
			if ($result=mysqli_query($link,"SELECT * FROM pouzivatelia WHERE id_pouzivatel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."'")){
				if (mysqli_num_rows($result) == 0){
					mysqli_query($link,"INSERT INTO pouzivatelia SET id_pouzivatel = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["id"])."', meno = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["meno"])."', priezvisko = '".mysqli_real_escape_string($link,$_SESSION["pouzivatel"]["priezvisko"])."'");
				}
			}
		}
		echo("podarilo sa prihlasit");
	}
}

?>