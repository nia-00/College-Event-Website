<?php
	$inData = getRequestInfo();

	$universityName = $inData["universityName"];
	$description = $inData["description"];
	$location = $inData["location"];
	$population = $inData["population"];


	$conn = new mysqli("localhost", "1-database","1Database", "COP4710");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into University (name,description,location,num_students) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $universityName, $description, $location, $population);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');

		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
