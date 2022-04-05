<?php
	$inData = getRequestInfo();

	$UID = $inData["UID"]; 
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];

	$conn = new mysqli("localhost", "1-database", "1Database", "COP4331"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		/* $stmt = $conn->prepare("UPDATE from Users WHERE Login=? AND Password=?");
		$stmt->bind_param("sss", $id, $login, $password);
		$stmt->execute(); */

		if (!empty($firstName))
		{
			$stmt = $conn->prepare("UPDATE Contacts SET FirstName=? WHERE UID=?");
			$stmt->bind_param("ss", $firstName, $UID);
			$stmt->execute();
		}

		if (!empty($lastName))
		{
			$stmt = $conn->prepare("UPDATE Contacts SET LastName=? WHERE UID=?");
			$stmt->bind_param("ss", $lastName, $UID);
			$stmt->execute();
		}

		if (!empty($email))
		{
			$stmt = $conn->prepare("UPDATE Contacts SET Email=? WHERE UID=?");
			$stmt->bind_param("ss", $email, $UID);
			$stmt->execute();
		}

		if (!empty($phone))
		{
			$stmt = $conn->prepare("UPDATE Contacts SET Phone=? WHERE UID=?");
			$stmt->bind_param("ss", $phone, $UID);
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
