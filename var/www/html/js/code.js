const urlBase = 'http://192.241.133.122/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let userType = "";
let university = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	userType = "";
	university = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				userType = jsonObject.userType;
				university = jsonObject.university;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = "An error occurred";
	}

}

function doSignUp()
{
    userId = 0;
    firstName = "";
    lastName = "";

    window.location.href = "register.html";
}

function doRegister()
{
	userId = 0;
	firstName = "";
	lastName = "";

	firstName = document.getElementById("userFirstName").value;
	lastName = document.getElementById("userLastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5(password);
  	var radios = document.getElementsByName("userType");
  	var selected = Array.from(radios).find(radio => radio.checked).value;
	var university = document.getElementById('university').selectedOptions[0].value;

	if (firstName == "") {
		document.getElementById("registerResult").innerHTML = "First name cannot be empty";
	} else if (lastName == "") {
		document.getElementById("registerResult").innerHTML = "Last name cannot be empty";
	} else if (login == "") {
		document.getElementById("registerResult").innerHTML = "Username cannot be empty";
	} else if (password == "") {
		document.getElementById("registerResult").innerHTML = "Password cannot be empty";
	} else {
		document.getElementById("registerResult").innerHTML = "";

		let tmp = {firstName:firstName,lastName:lastName,university:university,login:login,password:hash, userType:selected};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + 'LAMPAPI/Register.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "index.html";
				}
			};
			xhr.send(jsonPayload);
	    }
		catch(err)
		{
			document.getElementById("registerResult").innerHTML = "An error occurred";
		}
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "user_data=,"+"firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",userType=" + userType+ ",university=" + university  + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie; //excludes cookie name
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
		else if( tokens[0] == "userType" )
		{
			userType = tokens[1];
		}
		else if( tokens[0] == "university" )
		{
			university = tokens[1];
		}
	}

	if (userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = firstName + " " + lastName +  " is logged in as a " + userType + " from  " + university;
		searchEvents();
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
	alert('Logged out!');
}

function doGoToHomepage()
{
	window.location.href = "index.html";
}

function doDeleteUser()
{
    var result = confirm('Are you sure you want to delete your account?');
    if (result == true){
        readCookie();
        let tmp = {firstName:firstName,id:userId};
        let jsonPayload = JSON.stringify( tmp );

        let url = urlBase + 'LAMPAPI/DeleteUser.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try
        {
            xhr.send(jsonPayload);
            window.location.href = "index.html";
            alert('Sorry to see you go '+firstName+'. Your account was succesfully deleted.');
        }
        catch(err)
        {
            alert('SORRY your account could not be deleted');
        }
    }
}

function doGoToUpdateEvent(string, el)
{
	let oldName = "";
	let oldPrivacy = "";
	let oldType = "";
	let oldDate = "";
	let oldTime = "";
	let oldLocation = "";
	let oldDescription = "";
	let oldContact = "";
	let oldEmail = "";
	let oldPhone = "";
	let eventID = "";

	let Elem = el.parentElement.parentElement;
	oldName = Elem.querySelector('#eventName').innerHTML;
	oldPrivacy = Elem.querySelector('#privacy').innerHTML;
	oldType = Elem.querySelector('#eventType').innerHTML;
	oldDate = Elem.querySelector('#date').innerHTML;
	oldTime = Elem.querySelector('#time').innerHTML;
	oldLocation = Elem.querySelector('#location').innerHTML;
	oldDescription = Elem.querySelector('#description').innerHTML;
	oldContact = Elem.querySelector('#contactName').innerHTML;
	oldEmail = Elem.getElementsByTagName('a')[0].innerHTML;
	oldPhone = Elem.querySelector('#phone').innerHTML;
	eventID = el.parentElement.id;


	window.sessionStorage.setItem('eventName', oldName);
	window.sessionStorage.setItem('eventPrivacy', oldPrivacy);
	window.sessionStorage.setItem('eventEmail', oldEmail);
	window.sessionStorage.setItem('eventPhone', oldPhone);
	window.sessionStorage.setItem('eventType', oldType);
	window.sessionStorage.setItem('eventLocation', oldLocation);
	window.sessionStorage.setItem('eventDescription', oldDescription);
	window.sessionStorage.setItem('eventDate', oldDate);
	window.sessionStorage.setItem('eventTime', oldTime);
	window.sessionStorage.setItem('eventContact', oldContact);
	window.sessionStorage.setItem('eventID', eventID);

	window.location.href = "updateEvents.html";
}

function contactsAutoFill()
{
	document.getElementById("newEventName").setAttribute('value', window.sessionStorage.getItem('eventName'));
	document.getElementById("newEventType").setAttribute('value', window.sessionStorage.getItem('eventType'));
	document.getElementById("newDate").setAttribute('value', window.sessionStorage.getItem('eventDate'));
	document.getElementById("newTime").setAttribute('value', window.sessionStorage.getItem('eventTime'));
	document.getElementById("newLocation").setAttribute('value', window.sessionStorage.getItem('eventLocation'));
	document.getElementById("newDescription").setAttribute('value', window.sessionStorage.getItem('eventDescription'));
	document.getElementById("newContactName").setAttribute('value', window.sessionStorage.getItem('eventContact'));
	document.getElementById("newContactEmail").setAttribute('value', window.sessionStorage.getItem('eventEmail'));
	document.getElementById("newPhone").setAttribute('value', window.sessionStorage.getItem('eventPhone'));

}

function justReadCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}
}

function addEvent()
{
	let eventName = document.getElementById("newEventName").value;
	var privacy = document.getElementById('privacy').selectedOptions[0].value;
	let eventType = document.getElementById("newEventType").value;
	let date = document.getElementById("newDate").value;
	let time = document.getElementById("newTime").value;
	let location = document.getElementById("newLocation").value;
	let description = document.getElementById("newDescription").value;
	let contactName = document.getElementById("newContactName").value;
	let email = document.getElementById("newContactEmail").value;
	let phone = document.getElementById("newPhone").value;

	document.getElementById("eventsAddResult").innerHTML = "";

	justReadCookie();

	var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var rePhone = /^\d{3}-\d{3}-\d{4}$/;

	if (eventName == "") {
		document.getElementById("eventsAddResult").innerHTML = "Event name cannot be empty";
	} else if (eventType == "") {
		document.getElementById("eventsAddResult").innerHTML = "Event type cannot be empty";
	} else if (contactName == "") {
		document.getElementById("eventsAddResult").innerHTML = "Contact name cannot be empty";
	} else if (date == "") {
		document.getElementById("eventsAddResult").innerHTML = "Date cannot be empty";
	} else if (time == "") {
		document.getElementById("eventsAddResult").innerHTML = "Time cannot be empty";
	} else if (location == "") {
		document.getElementById("eventsAddResult").innerHTML = "Location cannot be empty";
	} else if (description == "") {
		document.getElementById("eventsAddResult").innerHTML = "Description cannot be empty";
	} else if (!reEmail.test(email)) {
		document.getElementById("eventsAddResult").innerHTML = "Email must be valid";
	} else if (!rePhone.test(phone)) {
		document.getElementById("eventsAddResult").innerHTML = "Phone number must be valid. Format: 555-555-5555";
	}	else {
		phone = phone.replaceAll('-','');
		let tmp = {userId:userId, eventName:eventName, privacy:privacy, eventType:eventType, date:date, time:time, contactName:contactName,email:email,phone:phone, location:location,description:description};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddEvent.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "contacts.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("eventsAddResult").innerHTML = "An error occurred";
		}
	}

}

function addRSO()
{
	let rsoName = document.getElementById("newRSOName").value;
	let description = document.getElementById("newDescription").value;
	let memberList = "";

	justReadCookie();

	let ownerName = firstName + " " +lastName;
	let ownerID = userId;

	for (var i = 0; i < 5; i++)
   	 {
		if(i==0){
			memberList =  memberList.concat("", document.getElementById("studentID" + (i+1)).value.trim());
		} else {
     	   		memberList = memberList.concat(", ", document.getElementById("studentID" + (i+1)).value.trim());
		}
   	 }

	document.getElementById("RSOAddResult").innerHTML = "";

	justReadCookie();

	if (rsoName == "") {
		document.getElementById("RSOAddResult").innerHTML = "RSO name cannot be empty";
	} else if (description == "") {
		document.getElementById("RSOAddResult").innerHTML = "Description cannot be empty";
	} else if (memberList[0] == "") {
		document.getElementById("RSOAddResult").innerHTML = "Student 1 cannot be empty";
	} else if (memberList[1] == "") {
		document.getElementById("RSOAddResult").innerHTML = "Student 2 cannot be empty";
	} else if (memberList[2] == "") {
		document.getElementById("RSOAddResult").innerHTML = "Student 3 cannot be empty";
	} else if (memberList[3] == "") {
		document.getElementById("RSOAddResult").innerHTML = "Student 4 cannot be empty";
	} else if (memberList[4] == "") {
		document.getElementById("RSOAddResult").innerHTML = "Student 5 cannot be empty";
	} else {
		let tmp = {rsoName:rsoName, ownerName:ownerName, ownerID:ownerID, description:description, memberList:memberList};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddRSO.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "RSO.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("RSOAddResult").innerHTML = "An error occurred";
		}
	}

}

function addUni()
{
	let uniName = document.getElementById("newUniName").value;
	let description = document.getElementById("newDescription").value;
	let location = document.getElementById("newLocation").value;
	let population = document.getElementById('newStudentPop').value;

	document.getElementById("uniAddResult").innerHTML = "";

	justReadCookie();

	if (uniName == "") {
		document.getElementById("uniAddResult").innerHTML = "University name cannot be empty";
	} else if (description == "") {
		document.getElementById("uniAddResult").innerHTML = "Description cannot be empty";
	} else if (location == "") {
		document.getElementById("uniAddResult").innerHTML = "Location cannot be empty";
	}  else if (population == "") {
		document.getElementById("uniAddResult").innerHTML = "Student population cannot be empty";
	} else {
		let tmp = {uniName:uniName, description:description, location:location, population:population};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddUniversity.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "contacts.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("uniAddResult").innerHTML = "An error occurred";
		}
	}

}

function searchEvents()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("eventsResult").innerHTML = "";

	let eventsList = "";

	let tmp = {search:srch,user:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/SearchEvents.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

				// This section takes care of formatting the HTML for the contacts list
				let eventsListElement = document.getElementById("eventsList");

				let e = document.querySelector('#eventsList');

				var child = e.firstChild;

				// This section clears contact list before every search
				while (child) {
					e.removeChild(child);
					child = e.firstChild;
				}

				if ("results" in jsonObject) {
					eventsListElement.style.display = "block";

					let eventsHeader = eventsListElement.appendChild(document.createElement("tr"));
					eventsHeader.setAttribute("id", "eventsHeader");

					let eventNameHeader = eventsHeader.appendChild(document.createElement("th"));
					eventNameHeader.innerHTML = "Event Name";
					let eventTypeHeader = eventsHeader.appendChild(document.createElement("th"));
					eventTypeHeader.innerHTML = "Event Type";
					let privacyHeader = eventsHeader.appendChild(document.createElement("th"));
					privacyHeader.innerHTML = "Privacy";
					let dateHeader = eventsHeader.appendChild(document.createElement("th"));
					dateHeader.innerHTML = "Date";
					let timeHeader = eventsHeader.appendChild(document.createElement("th"));
					timeHeader.innerHTML = "Time";
					let locationHeader = eventsHeader.appendChild(document.createElement("th"));
					locationHeader.innerHTML = "Location";
					let descriptionHeader = eventsHeader.appendChild(document.createElement("th"));
					descriptionHeader.innerHTML = "Description";
					let nameHeader = eventsHeader.appendChild(document.createElement("th"));
					nameHeader.innerHTML = "Contact Name";
					let emailHeader = eventsHeader.appendChild(document.createElement("th"));
					emailHeader.innerHTML = "Email";
					let phoneHeader = eventsHeader.appendChild(document.createElement("th"));
					phoneHeader.innerHTML = "Phone";


					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let eventElement = eventsListElement.appendChild(document.createElement("tr"));
						eventElement.setAttribute("id", "event"+i);
						eventElement.setAttribute("class", "event");

						let eventNameElement = eventElement.appendChild(document.createElement("td"));
						eventNameElement.setAttribute("id", "eventName");
						eventNameElement.innerHTML = jsonObject.results[i].eventName;

						let eventTypeElement = eventElement.appendChild(document.createElement("td"));
						eventTypeElement.setAttribute("id", "eventType");
						eventTypeElement.innerHTML = jsonObject.results[i].eventType;

						let privacyElement = eventElement.appendChild(document.createElement("td"));
						privacyElement.setAttribute("id", "privacy");
						privacyElement.innerHTML = jsonObject.results[i].privacy;

						let dateElement = eventElement.appendChild(document.createElement("td"));
						dateElement.setAttribute("id", "date");
						dateElement.innerHTML = jsonObject.results[i].date;

						let timeElement = eventElement.appendChild(document.createElement("td"));
						timeElement.setAttribute("id", "time");
						timeElement.innerHTML = jsonObject.results[i].time;

						let locationElement = eventElement.appendChild(document.createElement("td"));
						locationElement.setAttribute("id", "location");
						locationElement.innerHTML = jsonObject.results[i].location;

						let descriptionElement = eventElement.appendChild(document.createElement("td"));
						descriptionElement.setAttribute("id", "description");
						descriptionElement.innerHTML = jsonObject.results[i].description;

						let nameElement = eventElement.appendChild(document.createElement("td"));
						nameElement.setAttribute("id", "contactName");
						nameElement.innerHTML = jsonObject.results[i].contactName;

						let emailElement = eventElement.appendChild(document.createElement("td"));
						emailElement.setAttribute("id", "email");
						let emailLink = emailElement.appendChild(document.createElement("a"));
						emailLink.href = "mailto:" + jsonObject.results[i].email;
						emailLink.innerHTML = jsonObject.results[i].email;

						let phoneElement = eventElement.appendChild(document.createElement("td"));
						phoneElement.setAttribute("id", "phone");
						let phoneNumber = jsonObject.results[i].phone;
						phoneElement.innerHTML = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, 10);

						let moreInfoElement = eventElement.appendChild(document.createElement("td"));
						moreInfoElement.setAttribute("id", jsonObject.results[i].eventID);
						let moreInfoButton = moreInfoElement.appendChild(document.createElement("button"));
						moreInfoButton.setAttribute("type", "button");
						moreInfoButton.setAttribute("id", "moreInfoEventButton");
						moreInfoButton.setAttribute("class", "edit-button");
						moreInfoButton.setAttribute("onclick", "doGoToEventPage('update',this);");
						moreInfoButton.innerHTML = "More Info";

						let updateElement = eventElement.appendChild(document.createElement("td"));
						updateElement.setAttribute("id", jsonObject.results[i].eventID);
						let updateButton = updateElement.appendChild(document.createElement("button"));
						updateButton.setAttribute("type", "button");
						updateButton.setAttribute("id", "editEventButton");
						updateButton.setAttribute("class", "edit-button");
						updateButton.setAttribute("onclick", "doGoToUpdateEvent('update',this);");
						updateButton.innerHTML = "Edit";

					}
				} else {
					// TODO: if no results, display text showing that
					document.getElementById("eventsResult").innerHTML = "No Events Found"
					eventsListElement.style.display = "none";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("eventsResult").innerHTML = "An error occurred";
	}

}

function searchRSOs()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("rsosResult").innerHTML = "";

	let rsoList = "";

	let tmp = {search:srch,user:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/SearchRSO.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

				// This section takes care of formatting the HTML for the contacts list
				let rsoListElement = document.getElementById("rsoList");

				let e = document.querySelector('#rsoList');

				var child = e.firstChild;

				// This section clears contact list before every search
				while (child) {
					e.removeChild(child);
					child = e.firstChild;
				}

				if ("results" in jsonObject) {
					rsoListElement.style.display = "block";

					let rsoHeader = rsoListElement.appendChild(document.createElement("tr"));
					rsoHeader.setAttribute("id", "rsoHeader");

					let rsoNameHeader = rsoHeader.appendChild(document.createElement("th"));
					rsoNameHeader.innerHTML = "RSO Name";
					let rsoOwnerHeader = rsoHeader.appendChild(document.createElement("th"));
					rsoOwnerHeader.innerHTML = "RSO Owner";
					let rsoMembersHeader = rsoHeader.appendChild(document.createElement("th"));
					rsoMembersHeader.innerHTML = "RSO Member List";

					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let rsoElement = rsoListElement.appendChild(document.createElement("tr"));
						rsoElement.setAttribute("id", "rso"+i);
						rsoElement.setAttribute("class", "rso");

						let rsoNameElement = rsoElement.appendChild(document.createElement("td"));
						rsoNameElement.setAttribute("id", "rsoName");
						rsoNameElement.innerHTML = jsonObject.results[i].rsoName;

						let ownerElement = rsoElement.appendChild(document.createElement("td"));
						ownerElement.setAttribute("id", "owner");
						ownerElement.innerHTML = jsonObject.results[i].ownerName;

						let membersElement = rsoElement.appendChild(document.createElement("td"));
						membersElement.setAttribute("id", "members");
						membersElement.innerHTML = jsonObject.results[i].memberList;

						let deleteRSOElement = rsoElement.appendChild(document.createElement("td"));
						deleteRSOElement.setAttribute("id", jsonObject.results[i].rsoID);
						let deleteRSOButton = deleteRSOElement.appendChild(document.createElement("button"));
						deleteRSOButton.setAttribute("type", "button");
						deleteRSOButton.setAttribute("id", "deleteRSOButton");
						deleteRSOButton.setAttribute("class", "edit-button");
						deleteRSOButton.setAttribute("onclick", "deleteRSO('update', this);");
						deleteRSOButton.innerHTML = "Delete RSO";

						let joinRSOElement = rsoElement.appendChild(document.createElement("td"));
						joinRSOElement.setAttribute("id", jsonObject.results[i].rsoID);
						let joinRSOButton = joinRSOElement.appendChild(document.createElement("button"));
						joinRSOButton.setAttribute("type", "button");
						joinRSOButton.setAttribute("id", "joinRSOButton");
						joinRSOButton.setAttribute("class", "edit-button");
						joinRSOButton.setAttribute("onclick", "doJoinRSO('update', this);");
						joinRSOButton.innerHTML = "Join RSO";

					}
				} else {
					// TODO: if no results, display text showing that
					document.getElementById("rsoResult").innerHTML = "No RSOs Found"
					rsoListElement.style.display = "none";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("eventsResult").innerHTML = "An error occurred";
	}

}

function doJoinRSO(string, el)
{
	let Elem = el.parentElement.parentElement;
	let memberList = Elem.querySelector('#members').innerHTML;
	let ownerName = Elem.querySelector('#owner').innerHTML;
	let rsoID = el.parentElement.id;
	let isMember = false;

	justReadCookie();

	if(ownerName.trim() == (firstName +" "+ lastName)){
		alert("You are the owner of this RSO ")
		isMember = true;
	}

	let data = memberList;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split(" ");
		if( tokens[0] == firstName && tokens[1] == lastName )
		{
			alert("You are already a member of this RSO");
			isMember = true;
		}
	}

	if (!isMember){

		let newMemberList = memberList.concat( ", " + firstName + " " + lastName);

		let tmp = {rsoID:rsoID,memberList:newMemberList};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + 'LAMPAPI/UpdateRSOMemberList.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "RSO.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("updateResult").innerHTML = "An error occurred";
		}
	}

}

function doGoToAddEvent()
{
	window.location.href = "createEvents.html";
}

function doGoToCreateRSO()
{
	justReadCookie();
	if(userType=="adminUser"){
		window.location.href = "createRSO.html";
	} else {
		alert("Sorry only users with Admin privileges can create a new RSO");
	}
}

function doGoToCreateUni()
{
	justReadCookie();
	if(userType=="superAdminUser"){
		window.location.href = "createUniversity.html";
	} else {
		alert("Sorry only users with Super Admin privileges can add a new University");
	}
}

function doGoToJoinRSO()
{
	window.location.href = "RSO.html";
}

function doGoToEvents()
{
	window.location.href = "contacts.html";
}

function doGoToEventPage(string, el)
{

	let eventID = "";

	let Elem = el.parentElement.parentElement;
	eventID = el.parentElement.id;

	window.sessionStorage.clear();
	window.sessionStorage.setItem('eventID', eventID);

	window.location.href = "event.html";
}

function doDisplayEvent()
{
	let eventName = window.sessionStorage.getItem('eventName');
	let eventEmail = window.sessionStorage.getItem('eventEmail');
	let eventPhone = window.sessionStorage.getItem('eventPhone');
	let eventType = window.sessionStorage.getItem('eventType');
	let eventLocation = window.sessionStorage.getItem('eventLocation');
	let eventDescription = window.sessionStorage.getItem('eventDescription');
	let eventDate = window.sessionStorage.getItem('eventDate');
	let eventTime = window.sessionStorage.getItem('eventTime');
	let eventContact = window.sessionStorage.getItem('eventContact');
	let eventID = window.sessionStorage.getItem('eventID');


	let eventPageElement = document.getElementById("eventPage");
	eventPageElement.style.display = "block";


	let nameElement = eventPageElement.appendChild(document.createElement("field-text"));
	nameElement.setAttribute("id", "eventName");
	nameElement.innerHTML = "Event Name: " + eventName;
	eType = document.createElement("field-text");
	typeText = document.createTextNode("Event Type: " + eventType);
	eType.appendChild(typeText);
	document.getElementById("eventPage").appendChild(eType);

	eDesc = document.createElement("field-text");
	descText = document.createTextNode("Event Description: " + eventDescription);
	eDesc.appendChild(descText);
	document.getElementById("eventPage").appendChild(eDesc);

	eDate = document.createElement("field-text");
	dateText = document.createTextNode("Event Date: " + eventDate);
	eDate.appendChild(dateText);
	document.getElementById("eventPage").appendChild(eDate);

	eTime = document.createElement("field-text");
	timeText = document.createTextNode("Event Time: " + eventTime);
	eTime.appendChild(timeText);
	document.getElementById("eventPage").appendChild(eTime);

	eLoc = document.createElement("field-text");
	locText = document.createTextNode("Event Location: " + eventLocation);
	eLoc.appendChild(locText);
	document.getElementById("eventPage").appendChild(eLoc);

	eContact = document.createElement("field-text");
	contactText = document.createTextNode("Event Contact: " + eventContact);
	eContact.appendChild(contactText);
	document.getElementById("eventPage").appendChild(eContact);

	ePhone = document.createElement("field-text");
	phoneText = document.createTextNode("Event Phone: " + eventPhone);
	ePhone.appendChild(phoneText);
	document.getElementById("eventPage").appendChild(ePhone);

	eEmail = document.createElement("field-text");
	emailText = document.createTextNode("Event Email: " + eventEmail);
	eEmail.appendChild(emailText);
	document.getElementById("eventPage").appendChild(eEmail);


}

function doUpdateEvent()
{
	let eventID = window.sessionStorage.getItem('eventID');
	let eventName = document.getElementById("newEventName").value;
	var privacy = document.getElementById('privacy').selectedOptions[0].value;
	let eventType = document.getElementById("newEventType").value.toLowerCase();
	let date = document.getElementById("newDate").value;
	let time = document.getElementById("newTime").value;
	let location = document.getElementById("newLocation").value;
	let description = document.getElementById("newDescription").value;
	let contactName = document.getElementById("newContactName").value;
	let email = document.getElementById("newContactEmail").value;
	let phone = document.getElementById("newPhone").value;

	document.getElementById("updateResult").innerHTML = "";

	justReadCookie();

	var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var rePhone = /^\d{3}-\d{3}-\d{4}$/;
	if (eventName == "") {
		document.getElementById("updateResult").innerHTML = "Event name cannot be empty";
	} else if (eventType == "") {
		document.getElementById("updateResult").innerHTML = "Event type cannot be empty";
	} else if (contactName == "") {
		document.getElementById("updateResult").innerHTML = "Contact name cannot be empty";
	} else if (date == "") {
		document.getElementById("updateResult").innerHTML = "Date cannot be empty";
	} else if (time == "") {
		document.getElementById("updateResult").innerHTML = "Time cannot be empty";
	} else if (location == "") {
		document.getElementById("updateResult").innerHTML = "Location cannot be empty";
	} else if (description == "") {
		document.getElementById("updateResult").innerHTML = "Description cannot be empty";
	} else if (!reEmail.test(email)) {
		document.getElementById("updateResult").innerHTML = "Email must be valid";
	} else if (!rePhone.test(phone)) {
		document.getElementById("updateResult").innerHTML = "Phone number must be valid. Format: 555-555-5555";
	}	else {
		phone = phone.replaceAll('-','');
		let tmp = {eventID:eventID, eventName:eventName, privacy:privacy, eventType:eventType, date:date, time:time,contactName:contactName,email:email,phone:phone, location:location,description:description};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + 'LAMPAPI/UpdateEvent.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "contacts.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("updateResult").innerHTML = "An error occurred";
		}
	}
}

function doDeleteEvent()
{
	let eventID = window.sessionStorage.getItem('eventID');
	var result = confirm('Are you sure you want to delete this event?');

	document.getElementById("updateResult").innerHTML = "";

	if (result == true) {
		justReadCookie();
		let tmp = {eventID:eventID};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + 'LAMPAPI/DeleteEvent.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "contacts.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("updateResult").innerHTML = "An error occurred";
		}
	}
}

function deleteRSO(string, el)
{
	let Elem = el.parentElement.parentElement;
	let rsoID = el.parentElement.id;

	justReadCookie();

	if(userType=="adminUser"){

		var result = confirm('Are you sure you want to delete this RSO?');

		if (result == true) {
			justReadCookie();
			let tmp = {rsoID:rsoID};
			let jsonPayload = JSON.stringify(tmp);

			let url = urlBase + 'LAMPAPI/DeleteRSO.' + extension;

			let xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

			try
			{
				xhr.onreadystatechange = function()
				{
					if (this.readyState == 4 && this.status == 200)
					{
						window.location.href = "RSO.html";
					}
				};
				xhr.send(jsonPayload);
			}
			catch(err)
			{
				document.getElementById("rsoResult").innerHTML = "An error occurred";
			}
		}
	} else {
		alert("Sorry only users with Admin privileges can delete an RSO");
	}
}


function addComment()
{
	let comment= document.getElementById("newComment").value;
	var radios = document.getElementsByName("rating");
	var rating = Array.from(radios).find(radio => radio.checked);

	justReadCookie();

	if (comment == "") {
		document.getElementById("newComment").innerHTML = "Comment cannot be empty";
	} else {
		let tmp = {comment:comment, rating:rating};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddComments.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "event.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("comment_section").innerHTML = "An error occurred";
		}
	}
}

function displayComments()
{

	let eventID=window.sessionStorage.getItem('eventID');
	let search = "";

	let tmp = {eventID:eventID};


	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + 'LAMPAPI/ReturnCommentsInfo.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

				// This section takes care of formatting the HTML for the comments list
				let commentListElement = document.getElementById("commentList");

				let e = document.querySelector('#commentList');

				var child = e.firstChild;

				// This section clears contact list before every search
				while (child) {
					e.removeChild(child);
					child = e.firstChild;
				}

				if ("results" in jsonObject) {
					commentListElement.style.display = "block";

					let commentsHeader = commentListElement.appendChild(document.createElement("tr"));
					commentsHeader.setAttribute("id", "eventsHeader");

					let commentNameHeader = commentsHeader.appendChild(document.createElement("th"));
					commentNameHeader.innerHTML = "Commentor";
					let commentRatingHeader = commentsHeader.appendChild(document.createElement("th"));
					commentRatingHeader.innerHTML = "Rating";
					let commentTextHeader = commentsHeader.appendChild(document.createElement("th"));
					commentTextHeader.innerHTML = "Comment";


					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let commentElement = commentListElement.appendChild(document.createElement("tr"));
						commentElement.setAttribute("id", "comment"+i);
						commentElement.setAttribute("class", "comment");

						let commentNameElement = commentElement.appendChild(document.createElement("td"));
						commentNameElement.setAttribute("id", "commentOwner");
						commentNameElement.innerHTML = jsonObject.results[i].commentOwner;

						let commentRatingElement = commentElement.appendChild(document.createElement("td"));
						commentRatingElement.setAttribute("id", "rating");
						commentRatingElement.innerHTML = jsonObject.results[i].rating;

						let commentTextElement = commentElement.appendChild(document.createElement("td"));
						commentTextElement.setAttribute("id", "comment");
						commentTextElement.innerHTML = jsonObject.results[i].text;
					}
				} else {
					// TODO: if no results, display text showing that
					document.getElementById("commentResult").innerHTML = "No Comments Found"
					commentListElement.style.display = "none";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("commentResult").innerHTML = "An error occurred";
	}

}
