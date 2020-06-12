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
				'message': 'Okay'
			});
			break;

		case 'LIST':
			if (startTimers(message.data.timers)) {
				postMessage({
					'type': 'STATUS',
					'message': 'Okay'
				})
			}
			break;

		case 'REMOVE':
			clearInterval(timerIds[message.data.timer.name]);
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
	}, timer.time ?? 1e4);

	return true;
}
