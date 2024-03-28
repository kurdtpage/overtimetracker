let userid = 1;

/**
 * Formats a date in various different ways
 * @param {datetime} date Object that holds the date
 * @param {string} format The format to apply. Default is DAY DD MONTH, YYYY
 * @returns Formatted string representation of the date
 */
function formatDate(date, format) {
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	if (typeof date === 'string') {
		date = new Date(date);
	}

	const dayOfWeek = daysOfWeek[date.getDay()];
	const month = date.getMonth() + 1; // JavaScript months are zero-based, so we add 1
	const day = date.getDate();
	const year = date.getFullYear();

	if (format === 'MM/DD/YYYY') {
		return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
	} else if (format === 'DD/MM/YYYY') {
		return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
	} else if (format === 'YYYY-MM-DD') {
		return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	} else if (format === 'DAY MONTH DD, YYYY') {
		return `${dayOfWeek} ${months[date.getMonth()]} ${String(day).padStart(2, '0')}, ${year}`;
	} else {
		// Default format (DAY DD MONTH, YYYY)
		return `${dayOfWeek} ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
	}
}

//update "My approved overtime"
const xmlhttp0 = new XMLHttpRequest();
xmlhttp0.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const overtime = JSON.parse(this.responseText); // Parse the response to an array
		console.log(overtime);
		const format = document.getElementById('format');

		overtime.forEach(function(timeslot) {
			const tbody_myovertime = document.getElementById('tbody-myovertime');
			const tr = document.createElement('tr');
			const startdate = timeslot.start_time.split(' ')[0];
			const starttime = timeslot.start_time.split(' ')[1].split(':').slice(0, 2).join(':'); //remove seconds
			const enddate = timeslot.end_time.split(' ')[0];
			const endtime = timeslot.end_time.split(' ')[1].split(':').slice(0, 2).join(':'); //remove seconds

			tr.innerHTML = `
				<td>${formatDate(startdate, format.value)}<br>${starttime}</td>
				<td>${formatDate(enddate, format.value)}<br>${endtime}</td>
				<td>${timeslot.role_name}</td>
				<td>${timeslot.area_name}</td>
				<td style="color:green;">Approved</td>
			`;
			tbody_myovertime.appendChild(tr);
		});
	}
};

xmlhttp0.open('GET', `php/get-myovertime.php?userid=${userid}`, true);
xmlhttp0.send();

function getCookies() {
	const cookies = {};
	document.cookie.split(';').forEach(cookie => {
		const parts = cookie.split('=');
		const name = parts[0].trim();
		const value = decodeURIComponent(parts[1]);
		cookies[name] = value;
	});
	return cookies;
}

const cookies = getCookies();

if ('id' in cookies) { //user is logged in
	userid = cookies.id;
	document.getElementById('id').value = cookies.id;
	document.getElementById('email').value = cookies.email;
	document.getElementById('fullname').value = cookies.fullname;
	document.getElementById('phone').value = cookies.phone;
	//document.getElementById('role').value = cookies.role;
	document.getElementById('format').value = cookies.format;
} else {
	window.location.href = 'logout.php';
}

if (cookies.role != '0') {
	//not an admin, so hide admin tab
	const admin_tab = document.getElementById('admin-tab');
	admin_tab.style.display = 'none';
}

document.getElementById("dateformat1").innerText = `${formatDate(new Date(), 'MM/DD/YYYY')}`;
document.getElementById("dateformat2").innerText = `${formatDate(new Date(), 'DD/MM/YYYY')}`;
document.getElementById("dateformat3").innerText = `${formatDate(new Date(), 'YYYY-MM-DD')}`;
document.getElementById("dateformat4").innerText = `${formatDate(new Date(), 'DAY MONTH DD, YYYY')}`;
document.getElementById("dateformat5").innerText = `${formatDate(new Date(), 'DAY DD MONTH, YYYY')}`;

const profile_save = document.getElementById('profile-save');
if (profile_save) {
	profile_save.addEventListener('click', () => {
		//update user details
		const xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				if (this.responseText.substring(0, 2) == 'ok') {
					appendAlert('Your profile has been saved', 'success');
				} else {
					appendAlert('Your profile has not been saved', 'danger');
				}
			}
		};

		const formData = new FormData();
		formData.append('id', document.getElementById('id').value);
		formData.append('fullname', document.getElementById('fullname').value);
		formData.append('email', document.getElementById('email').value);
		formData.append('phone', document.getElementById('phone').value);
		formData.append('format', document.getElementById('format').value);
		if (document.getElementById('newPassword').value != '') {
			formData.append('oldPassword', document.getElementById('oldPassword').value);
			formData.append('newPassword', document.getElementById('newPassword').value);
		}

		xmlhttp.open('POST', 'php/post-profile.php', true);
		xmlhttp.send(formData);
	});
}
