<?php
	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$eventName = $inData["eventName"];
	$privacy = $inData["privacy"];
	$eventType = $inData["eventType"];
	$date = $inData["date"];
	$time = $inData["time"];
	$contactName = $inData["contactName"];
	$email = $inData["email"];
	$location = $inData["location"];
	$description = $inData["description"];
	$phone = $inData["phone"];

	$conn = new mysqli("localhost", "1-database","1Database", "COP4710");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Event (u_id,e_name,accessiblity,category,date,time,location,description,e_owner,email,phone) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
		$stmt->bind_param("sssssssssss", $userId, $eventName, $privacy, $eventType, $date, $time, $location, $description, $contactName, $email, $phone);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("yrp");
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
