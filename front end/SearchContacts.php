<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "1-database", "1Database", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// currently searches first name
		$stmt = $conn->prepare("select UID, FirstName, LastName, Email, Phone from Contacts where (FirstName like ? or LastName like ? or Email like ? or Phone like ?) and User=?");
		$search = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $search, $search, $search, $search, $inData["user"]);
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			// figure out how we want to format the json
			$searchResults .= '{"UID" : "' . $row["UID"] . '",';
			$searchResults .= '"firstName" : "' . $row["FirstName"] . '",';
			$searchResults .= '"lastName" : "' . $row["LastName"] . '",';
			$searchResults .= '"email" : "' . $row["Email"] . '",';
			$searchResults .= '"phone" : "' . $row["Phone"] . '"}';
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
