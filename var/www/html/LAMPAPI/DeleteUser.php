<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$id = $inData["id"];

	$conn = new mysqli("localhost","1-database" ,"1Database", "COP4710"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Deletes the contacts...
		$stmt = $conn->prepare("DELETE from Contacts WHERE User=?");
		$stmt->bind_param("s", $id);
		$stmt->execute();

		// And then the user.
		$stmt = $conn->prepare("DELETE from Users WHERE FirstName=? AND ID=?");
		$stmt->bind_param("ss", $firstName, $id);
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
