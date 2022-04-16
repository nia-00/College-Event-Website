<?php
	$inData = getRequestInfo();

	$commentOwner = $inData["commentOwner"];
	$eventID = $inData["eventID"];
	$text = $inData["text"];
	$rating = $inData["rating"];


	$conn = new mysqli("localhost", "1-database","1Database", "COP4710");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Comments (c_owner,e_id,text,rating) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $commentOwner, $eventID, $text, $rating);
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
