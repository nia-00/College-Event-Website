<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "1-database", "1Database", "COP4710");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// currently searches first name
		$stmt = $conn->prepare("select e_id, e_name, category, accessiblity, date, time, e_owner, email, phone, location, description, u_id from Event where (e_name like ?)");
		$search = "%" . $inData["search"] . "%";
		$stmt->bind_param("s", $search);
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
			$searchResults .= '{"eventID" : "' . $row["e_id"] . '",';
			$searchResults .= '"eventName" : "' . $row["e_name"] . '",';
			$searchResults .= '"eventType" : "' . $row["category"] . '",';
			$searchResults .= '"privacy" : "' . $row["accessiblity"] . '",';
			$searchResults .= '"date" : "' . $row["date"] . '",';
			$searchResults .= '"time" : "' . $row["time"] . '",';
			$searchResults .= '"contactName" : "' . $row["e_owner"] . '",';
			$searchResults .= '"email" : "' . $row["email"] . '",';
			$searchResults .= '"phone" : "' . $row["phone"] . '",';
			$searchResults .= '"location" : "' . $row["location"] . '",';
			$searchResults .= '"description" : "' . $row["description"] . '",';
			$searchResults .= '"UID" : "' . $row["u_id"] . '"}';
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
		$retValue = '{"eventID":0,"eventName":"","contactName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
