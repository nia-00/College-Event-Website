<?php
	$inData = getRequestInfo();

	$eventName = $inData["eventName"];
	$privacy = $inData["privacy"];
	$eventType = $inData["eventType"];
	$startDate = $inData["startDate"];
	$endDate = $inData["endDate"];
	$contactName = $inData["contactName"];
	$email = $inData["email"];
	$location = $inData["location"];
	$description = $inData["description"];
	$tags = $inData["tags"];

	$conn = new mysqli("localhost", "1-database","1Database", "COP4710");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Event (e_name,accessiblity,category,date,time,e_owner,email,location,description,phone) VALUES(?,?,?,?,?,?,?,?,?,?)");
		$stmt->bind_param("ssssssssss", $user, $firstName, $lastName, $email, $phone);
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
