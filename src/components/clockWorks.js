/**
 * Creates and manage web worker timer section.
 */
export class ClockWorks {
	/**
	 * Create a new list of timers
	 * @param {Array} timers the list of timers to install
	 */
	constructor(_timers = []) {
		this.timers = _timers;

		if (window.Worker) {
			this.startWorker();
		} else {
			this.spawnLocalTimers(_timers);
		}

		return this;
	}

	/**
	 * Add timers to the list.
	 */
	push(timer) {
		var index = this.timers.push(timer);

		this.worker.postMessage({
			type: 'TIMER',
			timer: { name: timer.name, time: timer.time, index: index - 1 }
		});

		return index;
	}

	/**
	 * Remove timer
	 */
	pull(timer) {
		if (timer instanceof Object) {
			this.timers = this.timers.filter((timersTimer, index) => {
				return timersTimer.name != timer.name;
			});
		} else {
			throw new Error('timer needs to be an object to be able to remove');
		}

		this.worker.postMessage({
			type: 'REMOVE',
			timer: {name: timer.name},
		})
	}

	/**
	 * The timers to start in the external workers
	 *
	 * @param {Array} timers list of timers
	 */
	startWorker() {
		this.worker = new Worker('../dist/clock-worker.js');
		this.worker.onmessage = this.handleWorkerMessages.bind(this);

		if (this.timers.length >= 1) {
			var newTimers = this.timers.reduce((taggedTimers, curr, index) => {
				taggedTimers.push({ name: curr.name, time: curr.time, index: index });
				return taggedTimers;
			}, [])

			this.worker.postMessage({
				type: 'LIST',
				timers: newTimers
			});
		}

	}

	handleWorkerMessages(message) {
		if (!message.data) {
			console.debug('Worker sending blank messages...');
			return;
		}

		switch (message.data.type) {
			case 'STATUS':
				console.log(message.data.message)
				break;
			case 'TIMER':
				const index = message.data.timer.index;
				try {
					this.timers[index].callback(message.data);
				} catch (error) {
					console.error(error);
				}
				break;
			default:
				console.debug(message.data);
				break;
		}
	}

	/**
	 * Starts the local system timers
	 */
	spawnLocalTimers(timers) {
		// timers.forEach((timer, index) => {
		// 	const intervalName = `${timer.name}-${index}`;
		// 	console.info(intervalName);
		// 	clearInterval(this.timers[intervalName]);
		// 	this.timers[intervalName] = setInterval(() => { timer.callback('internal') }, timer.time);
		// 	console.log(this.timers[intervalName])
		// });
	}
}
