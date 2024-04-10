let userid = 1;

/**
 * Formats a date in various different ways
 * @param {datetime} date Object that holds the date
 * @param {string} format The format to apply. Default is "DD d M, yy"
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

	if (format === 'm/d/yy') {
		return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
	} else if (format === 'd/m/yy') {
		return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
	} else if (format === 'yy-mm-dd') {
		return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	} else if (format === 'DD M d, yy') {
		return `${dayOfWeek} ${months[date.getMonth()]} ${String(day)}, ${year}`;
	} else {
		// Default format (DD d M, yy)
		return `${dayOfWeek} ${String(day)} ${months[date.getMonth()]}, ${year}`;
	}
}

document.getElementById('dateformat1').innerText = `${formatDate(new Date(), 'm/d/yy')}`;
document.getElementById('dateformat2').innerText = `${formatDate(new Date(), 'd/m/yy')}`;
document.getElementById('dateformat3').innerText = `${formatDate(new Date(), 'yy-mm-dd')}`;
document.getElementById('dateformat4').innerText = `${formatDate(new Date(), 'DD M d, yy')}`;
document.getElementById('dateformat5').innerText = `${formatDate(new Date(), 'DD d M, yy')}`;

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

if ('userid' in cookies) { //user is logged in
	userid = cookies.userid;
	document.getElementById('userid').value = cookies.userid;
	document.getElementById('email').value = cookies.email;
	document.getElementById('fullname').value = cookies.fullname;
	document.getElementById('phone').value = cookies.phone;
	document.getElementById('user-role').value = cookies.role_name;
	document.getElementById('format').value = cookies.format;
} else {
	console.log('user is not logged in');
	window.location.href = 'logout.php';
}

if (cookies.role != '0') {
	//not an admin, so hide admin tab
	const admin_tab = document.getElementById('admin-tab');
	admin_tab.style.display = 'none';
}

const profile_save = document.getElementById('profile-save');
if (profile_save) {
	profile_save.addEventListener('click', () => {
		//update user details
		const xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				if (JSON.parse(this.responseText).ok) {
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
