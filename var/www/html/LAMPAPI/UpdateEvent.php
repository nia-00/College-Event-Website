<?php
	$inData = getRequestInfo();
	
	$eventID = $inData["eventID"]; 
	$eventName = $inData["eventName"];
	$privacy = $inData["privacy"];
	$eventType = $inData["eventType"];
	$date = $inData["date"];
	$time = $inData["time"];
	$location = $inData["location"];
	$description = $inData["description"];
	$contactName = $inData["contactName"];
	$email = $inData["email"];
	$phone = $inData["phone"];

	$conn = new mysqli("localhost", "1-database", "1Database", "COP4710"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		/* $stmt = $conn->prepare("UPDATE from Users WHERE Login=? AND Password=?");
		$stmt->bind_param("sss", $id, $login, $password);
		$stmt->execute(); */

		if (!empty($eventName))
		{
			$stmt = $conn->prepare("UPDATE Event SET e_name=? WHERE e_id=?");
			$stmt->bind_param("ss", $eventName, $eventID);
			$stmt->execute();
		}

		if (!empty($privacy))
		{
			$stmt = $conn->prepare("UPDATE Event SET accessiblity=? WHERE e_id=?");
			$stmt->bind_param("ss", $privacy, $eventID);
			$stmt->execute();
		}

		if (!empty($eventType))
		{
			$stmt = $conn->prepare("UPDATE Event SET category=? WHERE e_id=?");
			$stmt->bind_param("ss", $eventType, $eventID);
			$stmt->execute();
		}

		if (!empty($date))
		{
			$stmt = $conn->prepare("UPDATE Event SET date=? WHERE e_id=?");
			$stmt->bind_param("ss", $date, $eventID);
			$stmt->execute();
		}

		if (!empty($time))
		{
			$stmt = $conn->prepare("UPDATE Event SET time=? WHERE e_id=?");
			$stmt->bind_param("ss", $time, $eventID);
			$stmt->execute();
		}

		if (!empty($location))
		{
			$stmt = $conn->prepare("UPDATE Event SET location=? WHERE e_id=?");
			$stmt->bind_param("ss", $location, $eventID);
			$stmt->execute();
		}

		if (!empty($description))
		{
			$stmt = $conn->prepare("UPDATE Event SET description=? WHERE e_id=?");
			$stmt->bind_param("ss", $description, $eventID);
			$stmt->execute();
		}

		if (!empty($contactName))
		{
			$stmt = $conn->prepare("UPDATE Event SET e_owner=? WHERE e_id=?");
			$stmt->bind_param("ss", $contactName, $eventID);
			$stmt->execute();
		}

		if (!empty($email))
		{
			$stmt = $conn->prepare("UPDATE Event SET email=? WHERE e_id=?");
			$stmt->bind_param("ss", $email, $eventID);
			$stmt->execute();
		}

		if (!empty($phone))
		{
			$stmt = $conn->prepare("UPDATE Event SET phone=? WHERE e_id=?");
			$stmt->bind_param("ss", $phone, $eventID);
			$stmt->execute();
		}

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
