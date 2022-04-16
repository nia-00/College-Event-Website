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
		$stmt = $conn->prepare("select r_id, r_owner, u_id, r_name, member_list from RSO where r_name like ?");
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
			$searchResults .= '{"rsoID" : "' . $row["r_id"] . '",';
			$searchResults .= '"ownerName" : "' . $row["r_owner"] . '",';
			$searchResults .= '"ownerID" : "' . $row["u_id"] . '",';
			$searchResults .= '"rsoName" : "' . $row["r_name"] . '",';
			$searchResults .= '"memberList" : "' . $row["member_list"] . '"}';

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
		$retValue = '{"rsoID":0,"rsoName":"","ownerName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
