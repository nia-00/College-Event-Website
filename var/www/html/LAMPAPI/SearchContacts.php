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
		$stmt = $conn->prepare("select e_id, e_name, e_owner, email, phone from Event where (e_name like ? or e_owner like ? or email like ? or phone like ?) and u_id=?");
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
			$searchResults .= '{"e_id" : "' . $row["e_id"] . '",';
			$searchResults .= '"e_name" : "' . $row["e_name"] . '",';
			$searchResults .= '"e_owner" : "' . $row["e_owner"] . '",';
			$searchResults .= '"email" : "' . $row["email"] . '",';
			$searchResults .= '"phone" : "' . $row["phone"] . '"}';
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
		$retValue = '{"id":0,"e_name":"","e_owner":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
