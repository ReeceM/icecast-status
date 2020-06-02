/**
 * icecast-status checker.
 *
 * Checks the status json from an icecast server and displays it pretty like
 * System auto refreshes and remembers the settings.
 *
 * @see https://github.com/reecem/icecast-status
 * @copyright 2020 ReeceM
 */

import { init as settingsInit, setStorage } from './components/store'
import 'alpinejs'
const axios = require('axios').default;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

window.headerTimer = () => {
	return {
		currentTime: (new Date()).toLocaleTimeString(),
		init() {
			setInterval(() => {
				this.currentTime = (new Date()).toLocaleTimeString();
			}, 1000)
		}
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
		currentInterval: 10,
		interval: 0,
		refreshedAt: null,
		refreshesAt: null,
		icecast: {},
		previousState: false,
		loading: false,
		saveSettings() {
			this.url = this.newUrl;
			this.currentInterval = this.onlineCheckInterval;
			setStorage(this);
			this.open_settings = false;
			this.refresh()
			this.loadSettings();
		},
		refresh() {
			clearInterval(this.interval)
			this.collect()
		},
		collect() {
			if (this.loading == true) {
				return;
			}
			console.info('[%s] Collecting', (new Date()).toLocaleTimeString());
			this.loading = true;
			axios.get(this.url, { cancelToken: source.token })
				.then(({
					data: {
						icestats
					}
				}) => {
					this.loading = false;

					this.icecast = icestats;

					if (icestats.hasOwnProperty('dummy')) {
						this.streams = []


						if (this.previousState != icestats.dummy) {
							console.info('Changing the timing')
							this.previousState = null;
							clearInterval(this.interval)
							this.currentInterval = this.offlineCheckInterval
							this.interval = setInterval(this.collect(), this.currentInterval * 1000)
						}

						document.title = `${document.querySelector('title').dataset.original} Offline`;
					}

					if (icestats.hasOwnProperty('source')) {
						console.info('has stats');

						this.streams = Array.isArray(icestats.source) ? icestats.source : [icestats.source];

						if (this.previousState == null) {
							this.previousState = true;
							clearInterval(this.interval)
							this.currentInterval = this.onlineCheckInterval
							this.interval = setInterval(this.collect(), this.currentInterval * 1000)
						}

						document.title = `${document.querySelector('title').dataset.original} ${this.streams.length } Online`;
					}

					this.setDates()
				})
				.catch(e => {
					this.loading = false;

					if (axios.isCancel(e)) {
						console.log('Request canceled', e.message);
					} else {
						alert(e);
						clearInterval(this.interval)
						this.currentInterval = this.offlineCheckInterval
						throw e;
					}
				});
		},
		setDates() {
			let now = new Date();
			this.refreshedAt = now.toLocaleTimeString();
			now.setSeconds(now.getSeconds() + this.currentInterval);
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
				this.collect()
				// this.interval = setInterval(this.collect(), this.currentInterval * 1000)
				console.log('starting up');
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
