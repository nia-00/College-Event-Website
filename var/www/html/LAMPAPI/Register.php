
<?php
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$university = $inData["university"];
	$login = $inData["login"];
	$password = $inData["password"];
        $userType = $inData["userType"];

	$conn = new mysqli("localhost", "1-database", "1Database", "COP4710");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName, university, Login,Password, user_types) VALUES(?,?,?,?,?,?)");
		$stmt->bind_param("ssssss", $firstName, $lastName, $university, $login, $password, $userType);
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
