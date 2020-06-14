let timerIds = {};
let timers = [];

onmessage = (message) => {
	if (!message.data) {
		postMessage(null);
	}

	switch (message.data.type) {
		case 'TIMER':
			startTimer(message.data.timer);
			postMessage({
				'type': 'STATUS',
				'message': 'Timer Added ' + message.data.timer.name
			});
			break;

		case 'LIST':
			if (startTimers(message.data.timers)) {
				postMessage({
					'type': 'STATUS',
					'message': 'Timer List updated'
				})
			}
			break;

		case 'REMOVE':
			clearInterval(timerIds[message.data.timer.name]);
			postMessage({
				type: 'STATUS',
				message: 'Timer Removed ' + message.data.timer.name
			})
			break;

		default:
			console.log(message);
			break;
	}

}

function startTimers(timers) {
	timers = Array.isArray(timers) ? timers : [timers];

	timers.forEach((timer, index)=> {
		startTimer(timer, index);
	});

	return true;
}

function startTimer(timer, index) {
	var index = index != null ? index : Math.random();

	clearInterval(timerIds[timer.name]);

	timerIds[timer.name] = setInterval(() => {
		postMessage({
			type: 'TIMER',
			timer: timer,
		})
	}, timer.time >= 999 ? timer : 10000 );

	return true;
}
