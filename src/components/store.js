/**
 * Local storage system to keep the urls for the servers to check
 *
 */
let instanceSettings = {
	version: '0.1.1',
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
			console.log(data)
			for (const setting in data) {
				if (data.hasOwnProperty(setting) && instanceSettings.hasOwnProperty(setting)) {
					console.log('Setting %s to %s', setting, data[setting]);
					instanceSettings[setting] = data[setting];
				}
			}

			return localStorage.setItem(storageKey, JSON.stringify(instanceSettings));
		} catch (error) {
			console.error(error)
			alert(error);
		}
	}
}
