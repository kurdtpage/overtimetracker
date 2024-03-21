const alertPlaceholder = document.getElementById('confirmPlaceholder');

const appendAlert = (message, type) => {
	const wrapper = document.createElement('div');
	const alertElement = document.createElement('div');
	alertElement.classList.add('alert', `alert-${type}`, 'alert-dismissible');
	alertElement.setAttribute('role', 'alert');
	alertElement.innerHTML = `
		<div>${message}</div>
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	`;
	wrapper.appendChild(alertElement);
	alertPlaceholder.appendChild(wrapper);

	// Automatically close the alert after 5 seconds
	if (type =="success") {
		setTimeout(() => {
			alertPlaceholder.removeChild(wrapper);
		}, 5000);
	}
};

const alertTrigger = document.getElementById('confirmBtn');
if (alertTrigger) {
	alertTrigger.addEventListener('click', () => {
		appendAlert('Your leave booking has been requested', 'success');
	});
}
