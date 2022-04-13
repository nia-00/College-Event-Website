const urlBase = 'http://192.241.133.122/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

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
  var selected = Array.from(radios).find(radio => radio.checked);
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
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
	}

	if (userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

function doGoToUpdateContact(string, el)
{
	let oldFirstName = "";
	let oldLastName = "";
	let oldEmail = "";
	let oldPhone = "";
	let UID = "";

	let contactElem = el.parentElement.parentElement;
	oldFirstName = contactElem.querySelector('#firstName').innerHTML;
	oldLastName = contactElem.querySelector('#lastName').innerHTML;
	oldEmail = contactElem.getElementsByTagName('a')[0].innerHTML;
	oldPhone = contactElem.querySelector('#phone').innerHTML;
	UID = el.parentElement.id;


	window.sessionStorage.setItem('contactFirstName', oldFirstName);
	window.sessionStorage.setItem('contactLastName', oldLastName);
	window.sessionStorage.setItem('contactEmail', oldEmail);
	window.sessionStorage.setItem('contactPhone', oldPhone);
	window.sessionStorage.setItem('contactUID', UID);

	window.location.href = "updateContacts.html";
}

function contactsAutoFill()
{
	document.getElementById("newFirstName").setAttribute('value', window.sessionStorage.getItem('contactFirstName'));
	document.getElementById("newLastName").setAttribute('value', window.sessionStorage.getItem('contactLastName'));
	document.getElementById("newEmail").setAttribute('value', window.sessionStorage.getItem('contactEmail'));
	document.getElementById("newPhone").setAttribute('value', window.sessionStorage.getItem('contactPhone'));
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

function addEvent() // *****UPDATE*****
{
	let eventName = document.getElementById("newEventName").value;
	var privacy = document.getElementById('privacy').selectedOptions[0].value;
	let eventType = document.getElementById("newEventType").value;
	let startDate = document.getElementById("newStart").value;
	let endDate = document.getElementById("newEnd").value;
	let contactName = document.getElementById("newContactName").value;
	let email = document.getElementById("newContactEmail").value;
	let location = document.getElementById("newLocation").value;
	let description = document.getElementById("newDescription").value;
	let tags = document.getElementById("newTags").value;

	document.getElementById("eventsAddResult").innerHTML = "";

	justReadCookie();

	var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (eventName == "") {
		document.getElementById("eventsAddResult").innerHTML = "Event name cannot be empty";
	} else if (eventType == "") {
		document.getElementById("eventsAddResult").innerHTML = "Event type cannot be empty";
	} else if (contactName == "") {
		document.getElementById("eventsAddResult").innerHTML = "Contact name cannot be empty";
	} else if (startDate == "") {
		document.getElementById("eventsAddResult").innerHTML = "Start date cannot be empty";
	} else if (endDate == "") {
		document.getElementById("eventsAddResult").innerHTML = "End date cannot be empty";
	} else if (location == "") {
		document.getElementById("eventsAddResult").innerHTML = "Location cannot be empty";
	} else if (description == "") {
		document.getElementById("eventsAddResult").innerHTML = "Description cannot be empty";
	} else if (tags == "") {
		document.getElementById("eventsAddResult").innerHTML = "Tags cannot be empty";
	} else if (!reEmail.test(email)) {
		document.getElementById("eventsAddResult").innerHTML = "Email must be valid";
	} else {
		let tmp = {eventName:eventName, privacy:privacy, eventType:eventType, startDate:startDate, endDate:endDate,contactName:contactName,email:email,location:location,description:description,tags:tags};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddContact.' + extension;

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
			document.getElementById("contactAddResult").innerHTML = "An error occurred";
		}
	}

}

function addRSO() // *****UPDATE*****
{
	let rsoName = document.getElementById("newRSOName").value;
	let description = document.getElementById("newDescription").value;
	let tags = document.getElementById("newTags").value;
	let rsoHeader = document.getElementById('rsoHeader');

	for (var i = 1; i < count; i++)
    {
        members[i-1] = document.getElementById("inputMemberName" + i).value;
    }

  var membersJSON = JSON.stringify(members);

	document.getElementById("RSOAddResult").innerHTML = "";

	justReadCookie();

	if (rsoName == "") {
		document.getElementById("RSOAddResult").innerHTML = "RSO name cannot be empty";
	} else if (description == "") {
		document.getElementById("RSOAddResult").innerHTML = "Description cannot be empty";
	} else if (tags == "") {
		document.getElementById("RSOAddResult").innerHTML = "Tags cannot be empty";
	}  else {
		let tmp = {rsoName:rsoName, description:description, tags:tags, rsoHeader:rsoHeader, members:members};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + 'LAMPAPI/AddContact.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					window.location.href = "rsos.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = "An error occurred";
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

	let url = urlBase + 'LAMPAPI/SearchContacts.' + extension;

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
					let startHeader = eventsHeader.appendChild(document.createElement("th"));
					startHeader.innerHTML = "Start Date";
					let endHeader = eventsHeader.appendChild(document.createElement("th"));
					endHeader.innerHTML = "End Date";
					let nameHeader = eventsHeader.appendChild(document.createElement("th"));
					nameHeader.innerHTML = "Contact Name";
					let emailHeader = eventsHeader.appendChild(document.createElement("th"));
					emailHeader.innerHTML = "Email";
					let locationHeader = eventsHeader.appendChild(document.createElement("th"));
					locationHeader.innerHTML = "Location";
					let descriptionHeader = eventsHeader.appendChild(document.createElement("th"));
					descriptionHeader.innerHTML = "Description";

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

						let startElement = eventElement.appendChild(document.createElement("td"));
						startElement.setAttribute("id", "startDate");
						let startDate = jsonObject.results[i].startDate;
						startElement.innerHTML = startDate.substring(0, 2) + "/" + startDate.substring(2, 4) + "/" + startDate.substring(4, 8);

						let endElement = eventElement.appendChild(document.createElement("td"));
						endElement.setAttribute("id", "endDate");
						let endDate = jsonObject.results[i].endDate;
						endElement.innerHTML = endDate.substring(0, 2) + "/" + endDate.substring(2, 4) + "/" + endDate.substring(4, 8);

						let nameElement = eventElement.appendChild(document.createElement("td"));
						nameElement.setAttribute("id", "contactName");
						nameElement.innerHTML = jsonObject.results[i].contactName;

						let emailElement = eventElement.appendChild(document.createElement("td"));
						emailElement.setAttribute("id", "email");
						let emailLink = emailElement.appendChild(document.createElement("a"));
						emailLink.href = "mailto:" + jsonObject.results[i].email;
						emailLink.innerHTML = jsonObject.results[i].email;

						let locationElement = eventElement.appendChild(document.createElement("td"));
						locationElement.setAttribute("id", "location");
						locationElement.innerHTML = jsonObject.results[i].location;

						let descriptionElement = eventElement.appendChild(document.createElement("td"));
						descriptionElement.setAttribute("id", "description");
						descriptionElement.innerHTML = jsonObject.results[i].description;

					}
				} else {
					// TODO: if no results, display text showing that
					document.getElementById("eventsResult").innerHTML = "No Contacts Found"
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

function doGoToAddEvent() // *****UPDATE*****
{
	window.location.href = "createEvents.html";
}

function doUpdateContact()
{
	let UID = window.sessionStorage.getItem('contactUID');
	let newFirstName = document.getElementById("newFirstName").value;
	let newLastName = document.getElementById("newLastName").value;
	let newEmail =  document.getElementById("newEmail").value;
	let newPhone =  document.getElementById("newPhone").value;

	document.getElementById("updateResult").innerHTML = "";

	justReadCookie();

	var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var rePhone = /^\d{3}-\d{3}-\d{4}$/;
	if (newFirstName == "") {
		document.getElementById("updateResult").innerHTML = "First name cannot be empty";
	} else if (newLastName == "") {
		document.getElementById("updateResult").innerHTML = "Last name cannot be empty";
	} else if (newEmail == "") {
		document.getElementById("updateResult").innerHTML = "Email name cannot be empty";
	} else if (newPhone == "") {
		document.getElementById("updateResult").innerHTML = "Phone number cannot be empty";
	} else if (!reEmail.test(newEmail)) {
		document.getElementById("updateResult").innerHTML = "Email must be valid";
	} else if (!rePhone.test(newPhone)) {
		document.getElementById("updateResult").innerHTML = "Phone number must be valid. Format: 555-555-5555";
	} else {
		newPhone = newPhone.replaceAll('-','');
		let tmp = {UID:UID, firstName:newFirstName, lastName:newLastName, email:newEmail, phone:newPhone};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + 'LAMPAPI/UpdateContact.' + extension;

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

function doDeleteContact()
{
	let UID = window.sessionStorage.getItem('contactUID');
	var result = confirm('Are you sure you want to delete this contact?');

	document.getElementById("updateResult").innerHTML = "";

	if (result == true) {
		justReadCookie();
		let tmp = {UID:UID};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + 'LAMPAPI/DeleteContact.' + extension;

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
