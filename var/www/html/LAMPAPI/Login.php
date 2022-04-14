<?php
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$university = "";
	$userType = "";

	$conn = new mysqli("localhost", "1-database", "1Database", "COP4710"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,firstName,lastName,university,user_types FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'], $row['user_types'], $row['university'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id, $userType, $university )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '", "userType":"' . $userType . '","university":"' . $university . '", "error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
