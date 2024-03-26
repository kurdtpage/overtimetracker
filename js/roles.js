const xmlhttp1 = new XMLHttpRequest();
xmlhttp1.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const roles = JSON.parse(this.responseText); // Parse the response to an array
		console.log(roles);
		let tabindex = 1;
		const tbody_roles = document.getElementById('tbody-roles');

		roles.forEach(function(role) {
			const rolenew = role.role_name.replace(/\s/g, '').toLowerCase(); //remove whitespace

			if (cookies.role === '0') { //admin
				//do admin form
				const roleid = document.getElementById('role');
				newElement = document.createElement('option');
				newElement.setAttribute('value', tabindex);
				newElement.innerText = role.role_name;
				roleid.appendChild(newElement);

				newElement = document.createElement('tr');
				newElement.setAttribute('id', `role-${role.id}`);
				newElement.innerHTML = `
					<td><input type="text" readonly="" class="form-control-plaintext" value="${role.id}"></td>
					<td><input type="text" class="form-control" value="${role.role_name}"></td>
					<td>
						<button type="submit" class="btn btn-primary">Update</button>
						<button type="submit" class="btn btn-danger">Delete</button>
					</td>
				`;
				tbody_roles.appendChild(newElement);
			} else { //normal user
				//do tabs at the top
				let rolesid = document.getElementById('roles');
				let newElement = document.createElement('li');
				newElement.setAttribute('class', 'nav-item');
				newElement.setAttribute('role', 'presentation');
				newElement.innerHTML = `
					<button
						id="role-${rolenew}-tab" 
						data-bs-target="#${rolenew}-tab-pane" 
						aria-controls="${rolenew}-tab-pane" 
						onclick="getData('${role.id}')"
						class="nav-link"
						data-bs-toggle="tab" 
						type="button" 
						role="tab" 
						aria-selected="false"
						>${role.role_name}
					</button>
				`;
				rolesid.appendChild(newElement);
				
				//next do the data in the tabs
				const tab_content = document.getElementById('tab-content');
				newElement = document.createElement('div');

				newElement.setAttribute('id', `${rolenew}-tab-pane`);
				newElement.setAttribute('aria-labelledby', `${rolenew}-tab`);
				newElement.setAttribute('class', 'tab-pane fade');
				newElement.setAttribute('role', 'tabpanel');
				newElement.setAttribute('tabindex', tabindex);

				newElement.innerHTML = `
					<table class="table table-striped">
						<thead>
							<tr>
								<th>Date</th>
								<th>Available slots (click to apply)</th>
								<th>Notify me</th>
							</tr>
						</thead>
						<tbody id="tbody-role-${role.id}"></tbody>
					</table>
				`;
				tab_content.appendChild(newElement);
			}
			tabindex++;
		});

		newElement = document.createElement('tr');
		newElement.setAttribute('id', 'role-new');
		newElement.innerHTML = `
			<td><input type="text" readonly="" class="form-control-plaintext" value="${tabindex}"></td>
			<td><input type="text" class="form-control"></td>
			<td>
				<button type="submit" class="btn btn-success">Add</button>
			</td>
		`;
		tbody_roles.appendChild(newElement);
	}
};

xmlhttp1.open('GET', 'php/get-roles.php', true);
xmlhttp1.send();

$(function() {
	$('#starttime').datetimepicker();
	$('#endtime').datetimepicker();
});
