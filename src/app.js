/**
 * icecast-status checker.
 *
 * Checks the status json from an icecast server and displays it pretty like
 * System auto refreshes and remembers the settings.
 *
 * @see https://github.com/reecem/icecast-status
 * @copyright 2020 ReeceM
 * @version 0.2.1
 */

import { init as settingsInit, setStorage } from './components/store'
import { ClockWorks } from './components/clockWorks'
import 'alpinejs'

const axios = require('axios').default;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const clockWorks = new ClockWorks();
clockWorks.push({
	name: 'clock',
	time: 1000,
	callback() {
		document.querySelector('[worker-clock]').__x.$data.currentTime = (new Date()).toLocaleTimeString();
	}
});

window.headerTimer = () => {
	return {
		currentTime: (new Date()).toLocaleTimeString(),
	}
}

window.streamStats = () => {
	return {
		open_settings: false,
		streams: null,
		url: 'https://example.com/status-json.xsl',
		newUrl: null,
		start: true,
		showDetails: false,
		mobileMenu: false,
		expand_server_details: false,
		onlineCheckInterval: 30,
		offlineCheckInterval: 60,
		newOnlineCheckInterval: null,
		newOfflineCheckInterval: null,
		currentInterval: 10,
		interval: 0,
		refreshedAt: null,
		refreshesAt: null,
		icecast: {},
		currentState: 'online',
		loading: false,
		saveSettings() {

			this.url = this.newUrl != null
				? this.newUrl
				: this.url;

			this.onlineCheckInterval = this.newOnlineCheckInterval != this.onlineCheckInterval
				? parseInt(this.newOnlineCheckInterval)
				: this.onlineCheckInterval;

			this.offlineCheckInterval = this.newOfflineCheckInterval != this.offlineCheckInterval
				? parseInt(this.newOfflineCheckInterval)
				: this.offlineCheckInterval;

			this.currentInterval = this.onlineCheckInterval;
			setStorage(this);
			this.open_settings = false;
			this.start = false;
			this.refresh()
			this.loadSettings();
		},
		refresh() {
			this.collect()
		},
		collect() {
			if (this.loading == true) {
				console.warn('Currently loading');
				return;
			}

			console.debug('[%s] Collecting', (new Date()).toLocaleTimeString());
			this.loading = true;

			axios.get(this.url, { cancelToken: source.token })
				.then(({
					data: {
						icestats
					}
				}) => {
					this.loading = false;

					this.icecast = icestats;

					var newState = 'offline';

					if (icestats.hasOwnProperty('dummy')) {
						this.streams = []
						document.title = `${document.querySelector('title').dataset.original} Offline`;
						newState = 'offline';
					}

					if (icestats.hasOwnProperty('source')) {
						this.streams = Array.isArray(icestats.source) ? icestats.source : [icestats.source];
						document.title = `${document.querySelector('title').dataset.original} ${this.streams.length} Online`;
						newState = 'online';
					}

					if (this.currentState == 'online' && newState == 'offline') {
						this.currentState = 'offline';
						this.setInterval(this.offlineCheckInterval)
					} else if (this.currentState == 'offline' && newState == 'online') {
						this.currentState = 'online';
						this.setInterval(this.onlineCheckInterval)
					}

					this.setDates();
				})
				.catch(e => {
					this.loading = false;

					if (axios.isCancel(e)) {
						console.log('Request canceled', e.message);
					} else {
						alert(e);
						this.setInterval(this.offlineCheckInterval)
						throw e;
					}
				});
		},
		setInterval(interval) {
			console.debug('setting timer to %s s', interval);
			this.currentInterval = interval;

			clockWorks.pull({
				name: 'refreshTimer',
			});

			clockWorks.push({
				name: 'refreshTimer',
				time: interval * 1000,
				callback() {
					console.log('Running');
					document.querySelector('[worker-main]').__x.$data.collect()
				}
			});
		},
		setDates() {
			let now = new Date();
			this.refreshedAt = now.toLocaleTimeString();
			now.setSeconds(now.getSeconds() + parseInt(this.currentInterval));
			this.refreshesAt = now.toLocaleTimeString();
		},
		loadSettings() {
			var settings = settingsInit();

			for (const setting in settings) {
				if (settings.hasOwnProperty(setting) && this.hasOwnProperty(setting)) {
					this[setting] = settings[setting];
				}
			}

			this.currentInterval = this.onlineCheckInterval;
		},
		init() {
			this.loadSettings()

			if (this.url != null && this.url != 'https://example.com/status-json.xsl') {
				this.start = false;
				this.collect();
			} else {
				this.start = true;
			}

			window.addEventListener('beforeunload', () => {
				console.info('Disconnection all the things. XD');
				clearInterval(this.interval);
				source.cancel('Webpage offloading');
			})
		}
	}
}
