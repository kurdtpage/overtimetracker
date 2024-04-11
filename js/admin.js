/**
 * Adds a new user. This is from the Admin tab, under "Manage users", then Add
 */
function adduser() {
	if (document.getElementById('user-new-name').value == '') {
		appendAlert('User not added. Please type in a name for the new user', 'warning');
		return;
	}
	if (document.getElementById('user-new-email').value == '') {
		appendAlert('User not added. Please type in an email address for the new user', 'warning');
		return;
	}
	if (document.querySelector('#user-new-role select').value == '') {
		appendAlert('User not added. Please select a role for the new user', 'warning');
		return;
	}

	const xmlhttp7 = new XMLHttpRequest();
	xmlhttp7.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
			if (JSON.parse(this.responseText).ok) {
				if (JSON.parse(this.responseText).password_emailed) {
					appendAlert('The user has been created. Their password was emailed to them', 'success');
				} else {
					appendAlert(`The user has been created. Password is: "${JSON.parse(this.responseText).password}", please let them know`, 'warning');
				}

				//add the new user into the user table (tbody-users)
				// Get values from input fields
				const newId = document.getElementById('user-new-id').value;
				const newName = document.getElementById('user-new-name').value;
				const newEmail = document.getElementById('user-new-email').value;
				const selectElement = document.getElementById('user-new-role');
				const newRole = selectElement.options[selectElement.selectedIndex].text;
			
				// Create a new table row
				const newRow = document.createElement('tr');
				newRow.id = `user-${newId}`; // Assign an id to the new row for future reference
			
				// Populate the new row with cells containing input elements
				newRow.innerHTML = `<td><input type="text" readonly="" class="form-control-plaintext" value="3"></td>
					<td><input type="text"  readonly="" class="form-control-plaintext" value="${newName}"></td>
					<td><input type="email" readonly="" class="form-control-plaintext" value="${newEmail}"></td>
					<td><input type="text"  readonly="" class="form-control-plaintext" value="${newRole}"></td>
					<td>
						<button type="submit" class="btn btn-primary update-user">Update</button>
						<button type="submit" class="btn btn-danger delete-user">Delete</button>
					</td>`;
			
				// Insert the new row before the last row (assuming the last row is the "Add" row)
				const addRow = document.getElementById('user-new').parentNode.parentNode;
				addRow.parentNode.insertBefore(newRow, addRow);

				//reset the "user-new" add form
				document.getElementById('user-new-id').value = parseInt(newId) + 1;
				document.getElementById('user-new-name').value = '';
				document.getElementById('user-new-email').value = '';
				document.querySelector('#user-new-role select').value == '';
			} else {
				appendAlert(`The user has not been created. ${JSON.parse(this.responseText).error}`, 'danger');
			}
		}
	};

	const formData = new FormData();
	formData.append('userid', 'insert');
	formData.append('fullname', document.getElementById('user-new-name').value);
	formData.append('email', document.getElementById('user-new-email').value);
	formData.append('role', document.querySelector('#user-new-role select').value);

	xmlhttp7.open('POST', 'php/post-profile.php', true);
	xmlhttp7.send(formData);
}

/**
 * Updates "Approved overtime" table
 */
function getapproved () {
	const xmlhttp3 = new XMLHttpRequest();
	xmlhttp3.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const requests = JSON.parse(this.responseText); // Parse the response to an array
			console.log(requests);
			const tbody_approved = document.getElementById('tbody-approved');
			
			if (requests.length != 0) {
				//clear out 'All overtime requests have been approved'
				tbody_approved.innerHTML = '';
			}

			requests.forEach(function(request) {
				/*
					timeslot.id,
					role.role_name,
					area.area_name,
					timeslot.start_time,
					timeslot.end_time,
					user.fullname
				*/
				
				let newElement = document.createElement('tr');
				newElement.setAttribute('id', `approved-${request.id}`);

				const startdate = request.start_time.split(' ')[0];
				const starttime = request.start_time.split(' ')[1].split(':').slice(0, 2).join(':'); //remove seconds
				const enddate = request.end_time.split(' ')[0];
				const endtime = request.end_time.split(' ')[1].split(':').slice(0, 2).join(':'); //remove seconds

				newElement.innerHTML = `
					<td>${request.role_name}</td>
					<td>${request.area_name}</td>
					<td>${formatDate(startdate, format.value)}<br>${starttime}</td>
					<td>${formatDate(enddate, format.value)}<br>${endtime}</td>
					<td>${request.fullname}</td>
					<td style="color:green;">Approved</td>
				`;		

				tbody_approved.appendChild(newElement);
			});
		}
	};
	xmlhttp3.open('GET', 'php/get-approved.php', true);
	xmlhttp3.send();
}

/**
 * Updates "Pending overtime Requests" table
 */
function getrequests() {
	const xmlhttp4 = new XMLHttpRequest();
	xmlhttp4.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const requests = JSON.parse(this.responseText); // Parse the response to an array
			console.log(requests);
			const tbody_requests = document.getElementById('tbody-requests');
			if (requests.length != 0) {
				//clear out whatevers already in there
				tbody_requests.innerHTML = '';
			}
			requests.forEach(function(request) {
				/*
					timeslot.id,
					role.role_name,
					area.area_name,
					timeslot.start_time,
					timeslot.end_time,
					user.fullname
				*/
				
				let newElement = document.createElement('tr');
				newElement.setAttribute('id', `request-${request.id}`);

				const startdate = request.start_time.split(' ')[0];
				const starttime = request.start_time.split(' ')[1].split(':').slice(0, 2).join(':'); //remove seconds
				const enddate = request.end_time.split(' ')[0];
				const endtime = request.end_time.split(' ')[1].split(':').slice(0, 2).join(':'); //remove seconds

				newElement.innerHTML = `
					<td>${request.role_name}</td>
					<td>${request.area_name}</td>
					<td>${formatDate(startdate, format.value)}<br>${starttime}</td>
					<td>${formatDate(enddate, format.value)}<br>${endtime}</td>
					<td>${request.fullname}</td>
					<td>
						<button type="button" class="btn btn-primary" onclick="approve('${request.id}')">Approve</button>
					</td>
				`;		

				tbody_requests.appendChild(newElement);
			});
		}
	};
	xmlhttp4.open('GET', 'php/get-requests.php', true);
	xmlhttp4.send();
}

/**
 * Updates "Manage users" table
 */
function getusers() {
	const xmlhttp5 = new XMLHttpRequest();
	xmlhttp5.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const users = JSON.parse(this.responseText); // Parse the response to an array
			console.log(users);
			const tbody_users = document.getElementById('tbody-users');
			let lastid = 0;

			//get roles
			const tbody = document.getElementById('tbody-roles');

			// Create the select element
			const select = document.createElement('select');
			select.id = 'role-select';
			select.className = 'form-select';

			// Iterate over table rows and create options, excluding the last row
			tbody.querySelectorAll('tr:not(:last-child)').forEach(row => {
				const id = row.querySelector('input[type="text"]').value;
				const role = row.querySelector('input[type="text"].form-control').value;

				const option = document.createElement('option');
				option.value = id;
				option.textContent = role;

				select.appendChild(option);
			});
			console.log(select);

			//get users
			users.forEach(function(user) {
				let newElement = document.createElement('tr');
				newElement.setAttribute('id', `user-${user.id}`);
				let buttons = `<button type="submit" class="btn btn-primary update-user">Update</button>
					<button type="submit" class="btn btn-danger delete-user">Delete</button>`;
				if (user.active == false) {
					newElement.classList.add('line-through');
					buttons = '<button type="submit" class="btn btn-primary restore-user">Reactivate</button>';
				}
				newElement.innerHTML = `
					<td><input type="text"  readonly="" class="form-control-plaintext" value="${user.id}"></td>
					<td><input type="text"  readonly="" class="form-control-plaintext" value="${user.fullname}"></td>
					<td><input type="email" readonly="" class="form-control-plaintext" value="${user.email}"></td>
					<td class="user-role"></td>
					<td>${buttons}</td>
				`;

				tbody_users.appendChild(newElement);
				lastid = user.id + 1;
			});

			// Create event listener for newly created "Update" buttons
			const updateButtons = document.querySelectorAll('.update-user');
			// Loop through each "Update" button and attach a click event listener
			updateButtons.forEach(function(button) {
				button.addEventListener('click', function() {
					// Get the parent row of the clicked button
					const row = button.closest('tr');

					// Get the ID and Role from the row
					const userid = row.querySelector('td:nth-child(1) input').value;
					const role = row.querySelector('.user-role select').value;
					const xmlhttp = new XMLHttpRequest();
					xmlhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							console.log(this.responseText);
							if (JSON.parse(this.responseText).ok) {
								appendAlert('The users role has been updated', 'success');
							} else {
								appendAlert(`The users role has not been updated. ${JSON.parse(this.responseText).error}`, 'danger');
							}
						}
					};

					const formData = new FormData();
					formData.append('userid', userid);
					formData.append('role', role);
					
					xmlhttp.open('POST', 'php/post-profile.php', true);
					xmlhttp.send(formData);
				});
			});

			// Create event listener for newly created "Delete" buttons
			const deleteButtons = document.querySelectorAll('.delete-user');
			// Loop through each "Delete" button and attach a click event listener
			deleteButtons.forEach(function(button) {
				button.addEventListener('click', function() {
					// Get the parent row of the clicked button
					const row = button.closest('tr');
					const userid = row.querySelector('td:nth-child(1) input').value;
					const xmlhttp = new XMLHttpRequest();
					xmlhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							console.log(this.responseText);
							if (JSON.parse(this.responseText).ok) {
								appendAlert('The user has been deleted', 'success');
								document.getElementById(`user-${id}`).classList.add('line-through');
							} else {
								appendAlert(`The user has not been deleted. ${JSON.parse(this.responseText).error}`, 'danger');
							}
						}
					};

					const formData = new FormData();
					formData.append('userid', userid);
					formData.append('action', 'delete');
					
					xmlhttp.open('POST', 'php/post-profile.php', true);
					xmlhttp.send(formData);
				});
			});

			// Create event listener for newly created "Restore" buttons
			const restoreButtons = document.querySelectorAll('.restore-user');
			// Loop through each "Restore" button and attach a click event listener
			restoreButtons.forEach(function(button) {
				button.addEventListener('click', function() {
					premium();
				});
			});

			//add new user
			let newElement = document.createElement('tr');
			newElement.setAttribute('id', 'user-new');
			newElement.innerHTML = `
				<td><input type="text" readonly="" class="form-control-plaintext" id="user-new-id" value="${lastid}"></td>
				<td><input type="text" class="form-control" id="user-new-name" placeholder="New name"></td>
				<td><input type="text" class="form-control" id="user-new-email" placeholder="New email"></td>
				<td class="user-role" id="user-new-role"></td>
				<td>
					<button type="submit" class="btn btn-success" id="add-user" onclick="adduser()">Add</button>
				</td>
			`;
			tbody_users.appendChild(newElement);

			// Replace the td with the select element
			const user_role = document.getElementsByClassName('user-role');
			// Iterate over each user role td element
			Array.from(user_role).forEach((td, index) => {
				// Clone the select element to avoid moving the same select element
				const clonedSelect = select.cloneNode(true);
				// Append the cloned select element to the td
				td.appendChild(clonedSelect);
				// Set a unique ID for each select element
				clonedSelect.id = `role-select-${index+1}`;
			});

			//update user role values
			users.forEach(function(user) {
				console.log(user);
				const role_select = document.getElementById(`role-select-${user.id}`);
				role_select.value = user.role;
			});

			//make the new user role empty
			const new_user_role = document.getElementById(`role-select-${lastid}`);
			new_user_role.value = '';
		}
	};
	xmlhttp5.open('GET', 'php/get-users.php', true);
	xmlhttp5.send();
}

/**
 * Updates Areas table
 */
function getareas() {
	const xmlhttp6 = new XMLHttpRequest();
	xmlhttp6.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const areas = JSON.parse(this.responseText); // Parse the response to an array
			console.log(areas);
			const tbody_areas = document.getElementById('tbody-areas');
			let lastid = 0;

			areas.forEach(function(area) {
				//update "Manage areas" table
				let newElement = document.createElement('tr');
				newElement.setAttribute('id', `area-${area.id}`);
				newElement.innerHTML = `
					<td><input type="text" readonly="" class="form-control-plaintext" value="${area.id}"></td>
					<td><input type="text" class="form-control" value="${area.area_name}"></td>
					<td>
						<button type="submit" class="btn btn-primary update-area" onclick="premium()">Update</button>
						<button type="submit" class="btn btn-danger delete-area" onclick="premium()">Delete</button>
					</td>
				`;
				tbody_areas.appendChild(newElement);

				//update Area in "Add new overtime record"
				const area_select = document.getElementById('area');
				const area_option = document.createElement('option');
				area_option.setAttribute('value', area.id);
				area_option.innerHTML = `${area.area_name}`;
				area_select.appendChild(area_option);

				lastid = area.id + 1;
			});

			document.getElementById('area').value = '';

			let newElement = document.createElement('tr');
			newElement.setAttribute('id', 'area-new');
			newElement.innerHTML = `
				<td><input type="text" readonly="" class="form-control-plaintext" value="${lastid}"></td>
				<td><input type="text" class="form-control" placeholder="New area"></td>
				<td>
					<button type="submit" class="btn btn-success" onclick="premium()">Add</button>
				</td>
			`;

			tbody_areas.appendChild(newElement);
		}
	};
	xmlhttp6.open('GET', 'php/get-areas.php', true);
	xmlhttp6.send();
}

if (cookies.role == 0) { //if admin...
	getapproved();
	getrequests();
	document.getElementById('area').value = ''; //sets the dropdown to nothing, just looks nice
	getusers();
	//roles is done in roles.js
	getareas();
}

/**
 * When admin clicks on Approve button in Pending overtime requests (tbody-requests)
 */
function approve(requestid) {
	//update requests table

	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (JSON.parse(this.responseText).ok) {
				appendAlert('Request approved', 'successs');
				getrequests();
			} else {
				appendAlert(`There was a problem approving this request. ${JSON.parse(this.responseText).error}`, 'danger');
				console.error(this.responseText);
			}
		}
	};

	const formData = new FormData();
	formData.append('requestid', requestid);

	xmlhttp.open('POST', 'php/post-request.php', true);
	xmlhttp.send(formData);
}

function premium () {
	appendAlert('This is a premium feature and is not supported in the free version. If you need to do this, please contact the administrator', 'warning');
}

//format the date inputs
$(function() {
	const options = {
		controlType: 'slider',
		stepHour: 1,
		stepMinute: 30,
		dateFormat: cookies.format,
		timeFormat: 'HH:mm'
	};
	$('#starttime').datepicker('option', 'dateFormat', cookies.format);
	$('#endtime').datepicker('option', 'dateFormat', cookies.format);
	$('#starttime').datetimepicker(options);
	$('#endtime').datetimepicker(options);
});
