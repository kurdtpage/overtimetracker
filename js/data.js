/**
 * Gets the number of hours difference between two times
 * @param {time} start_time Time value in format of hh:mm:ss
 * @param {time} end_time Time value in format of hh:mm:ss
 * @returns Integer of how many hours in between the two times
 */
function getHours(start_time, end_time) {
	// Parse time strings into Date objects
	const start = new Date("1970-01-01T" + start_time + "Z");
	const end = new Date("1970-01-01T" + end_time + "Z");

	// Calculate time difference in milliseconds
	const timeDiff = end - start;

	// Convert milliseconds to hours and round to 1 decimal place
	const hours = timeDiff / (1000 * 60 * 60);
	const roundedHours = hours.toFixed(1);

	return parseFloat(roundedHours); // Convert back to float if needed
}

/**
 * This runs when a tickbox in the "Notify me" section of the table is changed
 * @param {string} notify_id The id of the tickbox
 */
function notify(notify_id) {
	const tickbox = document.getElementById(notify_id);    
	const id = tickbox.getAttribute('id');

	if (id.substring(0, 6) == 'notify') {
		const state = tickbox.checked;
		const formData = new FormData();

		// Append id and state to the FormData object
		formData.append('id', id);
		console.log('id', id);
		formData.append('state', state);

		// Send a POST request to post-notify.php
		fetch('php/post-notify.php', {
			method: 'POST',
			body: formData
		})
		.then(response => {
			if (!response.ok) {
				let errormessage = 'Network response was not ok';
				appendAlert(errormessage, 'danger');
				throw new Error(errormessage);
			}
			return response.text();
		})
		.then(data => {
			let errormessage = data;
			appendAlert(errormessage, 'success');
			console.log(errormessage);
			// Handle response from server if needed
		})
		.catch(error => {
			let errormessage = 'There was a problem with the fetch operation:';
			appendAlert(errormessage + ' ' + error, 'danger');
			console.error(errormessage, error);
			// Handle error if needed
		});
	}
}

/**
 * Generates the next 30 days, and puts the data next to the values
 * @param {int} role The role id
 */
function getData (role) {
	//const rolenew = role.replace(/\s/g, "").toLowerCase();

	//generate 30 days of rows
	const tbody = document.getElementById("tbody-role-" + role);
	tbody.innerHTML = '';
	
	const today = new Date();
	const endDate = new Date(today);
	endDate.setDate(today.getDate() + 30);

	const currentDate = new Date(today);
	const format = document.getElementById("format");

	while (currentDate <= endDate) {
		const newElement = document.createElement("tr");
		newElement.innerHTML = `
			<td>${formatDate(currentDate, format.value)}</td>
			<td id="role${role}-${formatDate(currentDate, 'YYYY-MM-DD')}"></td>
			<td><input type="checkbox" class="form-check-input" onclick="notify('notify-${role}-${formatDate(currentDate, 'YYYY-MM-DD')}')" id="notify-${role}-${formatDate(currentDate, 'YYYY-MM-DD')}"></td>
		`;
		tbody.appendChild(newElement);
		
		currentDate.setDate(currentDate.getDate() + 1);
	}

	//get data from db for "Available slots" buttons
	const xmlhttp2 = new XMLHttpRequest();	
	xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const data = JSON.parse(this.responseText); // Parse the response to an array

			data.forEach(function(timeslot) {
				const id = timeslot.id;
				const area_name = timeslot.area_name;
				const startdate = timeslot.start_time.split(" ")[0]; //yyyy-mm-dd
				const starttime = timeslot.start_time.split(" ")[1].split(":").slice(0, 2).join(":"); //remove seconds
				const endtime = timeslot.end_time.split(" ")[1].split(":").slice(0, 2).join(":"); //remove seconds
				const parentElement = document.getElementById(`role${role}-${startdate}`);

				const newElement = document.createElement("button");
				newElement.setAttribute("id", id);
				newElement.setAttribute("type", "button");
				newElement.setAttribute("class", "btn btn-primary");
				newElement.setAttribute("data-bs-toggle", "modal");
				newElement.setAttribute("data-bs-target", "#confirmModal");
				newElement.innerHTML = `${area_name} ${starttime} - ${endtime} (${getHours(starttime, endtime)} hours)`;
				parentElement.appendChild(newElement);
			});
		}
	};
	xmlhttp2.open("GET", "php/get-data.php?userid=" + userid + "&role=" + role, true);
	xmlhttp2.send();

	//get data from db for "Notify me" tick boxes
	const xmlhttp6 = new XMLHttpRequest();	
	xmlhttp6.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const data = JSON.parse(this.responseText); // Parse the response to an array

			data.forEach(function(notify) {
				const tickboxElement = document.getElementById(`notify-${notify.role}-${notify.start_time.split(' ')[0]}`);
				tickboxElement.setAttribute("checked", true);
			});
		}
	};
	xmlhttp6.open("GET", "php/get-notify.php?userid=" + userid + "&role=" + role, true);
	xmlhttp6.send();
}

//three tick box thing
let checks = 0;

const confirmModal = document.getElementById('confirmModal')
confirmModal.addEventListener('show.bs.modal', event => {
	//unchecks the 3 tick boxes once the modal is shown
	const check1 = document.getElementById("check1");
	const check2 = document.getElementById("check2");
	const check3 = document.getElementById("check3");

	check1.checked = false;
	check2.checked = false;
	check3.checked = false;

	confirmBtn.disabled = true;
	checks = 0;
})

const check1 = document.getElementById("check1");
const check2 = document.getElementById("check2");
const check3 = document.getElementById("check3");

check1.addEventListener('change', checkchange);
check2.addEventListener('change', checkchange);
check3.addEventListener('change', checkchange);

function checkchange() {
	const confirmBtn = document.getElementById("confirmBtn");
	if (this.checked) {
		checks++;
		if (checks === 3) {
			confirmBtn.disabled = false;
		} else {
			confirmBtn.disabled = true;
		}
	} else {
		checks--;
		if (checks < 0) {
			checks = 0; // Ensure checks does not go negative
		}
		confirmBtn.disabled = true;
	}
}
