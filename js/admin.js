//update "Approved overtime" table
const xmlhttp3 = new XMLHttpRequest();
xmlhttp3.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const requests = JSON.parse(this.responseText); // Parse the response to an array
		console.log(requests);
		
		requests.forEach(function(request) {
			/*
				timeslot.id,
				role.role_name,
				area.area_name,
				timeslot.start_time,
				timeslot.end_time,
				user.fullname
			*/
			const tbody_approved = document.getElementById('tbody-approved');
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

//update "Pending overtime Requests" table
const xmlhttp4 = new XMLHttpRequest();
xmlhttp4.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const requests = JSON.parse(this.responseText); // Parse the response to an array
		console.log(requests);
		
		requests.forEach(function(request) {
			/*
				timeslot.id,
				role.role_name,
				area.area_name,
				timeslot.start_time,
				timeslot.end_time,
				user.fullname
			*/
			const tbody_requests = document.getElementById('tbody-requests');
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
					<button type="button" class="btn btn-primary">Approve</button>
					<button type="button" class="btn btn-danger">Decline</button>
				</td>
			`;		

			tbody_requests.appendChild(newElement);
		});
	}
};
xmlhttp4.open('GET', 'php/get-requests.php', true);
xmlhttp4.send();

//update "Manage users" table
const xmlhttp5 = new XMLHttpRequest();
xmlhttp5.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const users = JSON.parse(this.responseText); // Parse the response to an array
		console.log(users);
		const tbody_users = document.getElementById('tbody-users');
		let lastid = 0;

		//get roles
		const tbody = document.getElementById('tbody-roles');

		// Get the select element or create one if it doesn't exist
		let select = document.getElementById('role-select');
		if (!select) {
			select = document.createElement('select');
			select.id = 'role-select';
		}

		// Clear any existing options
		select.innerHTML = '';

		// Iterate over table rows and create options, excluding the last row
		tbody.querySelectorAll('tr:not(:last-child)').forEach(row => {
			const id = row.querySelector('input[type="text"]').value;
			const role = row.querySelector('input[type="text"].form-control').value;

			const option = document.createElement('option');
			option.value = id;
			option.textContent = role;

			select.appendChild(option);
		});

		// Replace the table with the select element
		tbody.parentNode.replaceChild(select, tbody);


		//get users
		users.forEach(function(user) {
			let newElement = document.createElement('tr');
			newElement.setAttribute('id', `user-${user.id}`);
			newElement.innerHTML = `
				<td><input type="text" readonly="" class="form-control-plaintext" value="${user.id}"></td>
				<td><input type="text" readonly="" class="form-control-plaintext" value="${user.fullname}"></td>
				<td><select class="form-select role" id="user-role" name="role"></select></td>
				<td>
					<button type="submit" class="btn btn-primary">Update</button>
					<button type="submit" class="btn btn-danger">Delete</button>
				</td>
			`;

			tbody_users.appendChild(newElement);
			lastid = user.id + 1;
		});

		let newElement = document.createElement('tr');
		newElement.setAttribute('id', 'user-new');
		newElement.innerHTML = `
			<td><input type="text" readonly="" class="form-control-plaintext" value="${lastid}"></td>
			<td><input type="text" class="form-control">name</td>
			<td><input type="text" class="form-control">role</td>
			<td>
				<button type="submit" class="btn btn-success">Add</button>
			</td>
		`;

		tbody_users.appendChild(newElement);
	}
};
xmlhttp5.open('GET', 'php/get-users.php', true);
xmlhttp5.send();

//update Areas table
const xmlhttp6 = new XMLHttpRequest();
xmlhttp6.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const areas = JSON.parse(this.responseText); // Parse the response to an array
		console.log(areas);
		const tbody_areas = document.getElementById('tbody-areas');
		let lastid = 0;

		areas.forEach(function(area) {
			let newElement = document.createElement('tr');
			newElement.setAttribute('id', `area-${area.id}`);
			newElement.innerHTML = `
				<td><input type="text" readonly="" class="form-control-plaintext" value="${area.id}"></td>
				<td><input type="text" class="form-control" value="${area.area_name}"></td>
				<td>
					<button type="submit" class="btn btn-primary">Update</button>
					<button type="submit" class="btn btn-danger">Delete</button>
				</td>
			`;

			tbody_areas.appendChild(newElement);
			lastid = area.id + 1;
		});

		let newElement = document.createElement('tr');
		newElement.setAttribute('id', 'area-new');
		newElement.innerHTML = `
			<td><input type="text" readonly="" class="form-control-plaintext" value="${lastid}"></td>
			<td><input type="text" class="form-control"></td>
			<td>
				<button type="submit" class="btn btn-success">Add</button>
			</td>
		`;

		tbody_areas.appendChild(newElement);
	}
};
xmlhttp6.open('GET', 'php/get-areas.php', true);
xmlhttp6.send();
