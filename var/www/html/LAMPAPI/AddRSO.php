<?php
	$inData = getRequestInfo();

	$rsoName = $inData["rsoName"];
	$ownerName = $inData["ownerName"];
	$ownerID = $inData["ownerID"];
	$description = $inData["description"];
	$memberList = $inData["memberList"];


	$conn = new mysqli("localhost", "1-database","1Database", "COP4710");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into RSO (r_name,r_owner,u_id,description,member_list) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $rsoName, $ownerName, $ownerID, $description, $memberList);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("made it");
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
