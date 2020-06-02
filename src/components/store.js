/**
 * Local storage system to keep the urls for the servers to check
 *
 * @see https://github.com/reecem/icecast-status
 * @copyright 2020 ReeceM
 * @version 0.2.1
 */
let instanceSettings = {
	version: '0.2.1',
	onlineCheckInterval: 30,
	offlineCheckInterval: 60,
	currentInterval: 10,
	url: null,
};

let storageKey = 'icecast-status';

function hasLocalStorage() {
	return window.localStorage || localStorage;
}

export function init() {
	if (! hasLocalStorage()) {
		alert('the device does not support localStorage, settings will be lost on page reload');

		return;
	}

	var currentStore = getStorage({});

	if (instanceSettings.version === currentStore.version) {
		Object.assign(instanceSettings, currentStore);
	} else {
		/** Load the old URL so we don't have to keep entering it */
		instanceSettings.url = currentStore.url;
		setStorage(instanceSettings);
		init()
		return;
	}

	return instanceSettings;
}

export function getStorage(_default) {
	if (hasLocalStorage()) {
		try {
			return JSON.parse(localStorage.getItem(storageKey)) || _default;
		} catch (error) {
			console.error(error)
			alert(error);
		}
	}
}

export function setStorage(data) {
	if (hasLocalStorage()) {
		try {
			for (const setting in data) {
				if (data.hasOwnProperty(setting) && instanceSettings.hasOwnProperty(setting)) {
					process.env.NODE_ENV == 'development' ? console.debug('Setting %s to %s', setting, data[setting]) : '';
					instanceSettings[setting] = data[setting];
				}
			}

			return localStorage.setItem(storageKey, JSON.stringify(instanceSettings));
		} catch (error) {
			console.error(error)
		}
	}
}
