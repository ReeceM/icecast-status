/**
 * icecast-status checker.
 *
 * Checks the status json from an icecast server and displays it pretty like
 * System auto refreshes and remembers the settings.
 *
 * @see https://github.com/reecem/icecast-status
 * @copyright 2020 ReeceM
 */

import { init, setStorage } from './components/store'
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
        refreshedAt: null,
		refreshesAt: null,
		icecast: {},
        previousState: [],
		loading: false,
		saveSettings() {
			this.url = this.newUrl;
			setStorage(this);
			this.open_settings = false;
			this.refresh()
		},
        refresh() {
            clearInterval(this.interval)
			this.init()
            // setTimeout(() => {
            // }, 2000);
        },
        collect() {
			this.loading = true;

            axios.get(this.url, { cancelToken: source.token })
                .then(({
                    data: {
                        icestats
                    }
                }) => {
					this.loading = false;

                    if (icestats.dummy == null) {
                        this.streams = []

						this.icecast = icestats;

                        if (this.previousState != icestats.dummy) {
                            console.info('Changing the timing')
                            this.previousState = null;
                            clearInterval(this.interval)
                            this.currentInterval = this.offlineCheckInterval
                            this.init()
                        }
                    }

                    if (icestats.source != undefined) {
                        console.info('has stats');
                        this.streams = Array.isArray(icestats.source) ? icestats.source : [icestats.source];
                        if (this.previousState == null) {
                            this.previousState = true;
                            this.currentInterval = this.onlineCheckInterval
                            this.init()
                        }
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
						this.init()
						throw e;
					}
                });
        },
        interval: 0,
        setDates() {
            let now = new Date();
            this.refreshedAt = now.toLocaleTimeString();
            now.setSeconds(now.getSeconds() + (this.currentInterval));
            this.refreshesAt = now.toLocaleTimeString();
        },
		init() {
			if (this.url != null && this.url != 'https://example.com/status-json.xsl') {
				this.start = false;
				this.collect();
				console.log('interval %s', this.currentInterval * 1000);
				this.interval = setInterval(() => {
					if (this.loading == true) {
						return;
					}
					console.info('[%s] Collecting', (new Date()).toLocaleTimeString());
					this.collect()
				}, this.currentInterval * 1000)
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
