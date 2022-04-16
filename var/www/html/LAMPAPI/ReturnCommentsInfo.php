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
		$stmt = $conn->prepare("select c_id, c_owner, e_id, text, rating from Comments where e_id = ?");
		$stmt->bind_param("s", $inData["eventID"]);
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
			$searchResults .= '{"commentID" : "' . $row["c_id"] . '",';
			$searchResults .= '"commentOwner" : "' . $row["c_owner"] . '",';
			$searchResults .= '"eventID" : "' . $row["e_id"] . '",';
			$searchResults .= '"text" : "' . $row["text"] . '",';
			$searchResults .= '"rating" : "' . $row["rating"] . '"}';

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
		$retValue = '{"commentID":0,"text":"","commentOwner":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
