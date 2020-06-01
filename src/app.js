// "!loading ? 'Refresh' : 'Refreshing ...'"
import { init, setStorage } from './components/store'

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
            this.collect()
            setTimeout(() => {
                this.init()
            }, 2000);
        },
        collect() {
			this.loading = true;

            axios.get(this.url)
                .then(({
                    data: {
                        icestats
                    }
                }) => {
                    this.loading = false;


                    console.warn('Dummy %s', icestats.dummy)

                    if (icestats.dummy == null) {
                        this.streams = []

						this.icecast = icestats;

                        if (this.previousState != icestats.dummy) {
                            console.log('Changing the timing')
                            this.previousState = null;
                            clearInterval(this.interval)
                            this.currentInterval = this.offlineCheckInterval
                            this.init()
                        }
                    }

                    if (icestats.source != undefined) {
                        console.log('has stats');
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
                    alert(e);
                    this.loading = false;
                    throw e;
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
			var settings = init();

			for (const setting in settings) {
				if (settings.hasOwnProperty(setting) && this.hasOwnProperty(setting)) {
					this[setting] = settings[setting];
				}
			}

			if (this.url != null && this.url != 'https://example.com/status-json.xsl') {
				this.collect();
				this.interval = setInterval(() => {
					if (this.loading == true) {
						return;
					}
					console.log('[%s] Collecting', (new Date()).toLocaleTimeString());
					this.collect()
				}, this.currentInterval * 1000)
			}
        }
    }
}
