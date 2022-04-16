<?php
	$inData = getRequestInfo();
	
	$rsoID = $inData["rsoID"]; 
	$memberList = $inData["memberList"];

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

		if (!empty($memberList))
		{
			$stmt = $conn->prepare("UPDATE RSO SET member_list=? WHERE r_id=?");
			$stmt->bind_param("ss", $memberList, $rsoID);
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
