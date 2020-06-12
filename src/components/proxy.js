export function proxy(url, headers = {}) {
	return new Promise((resolve, reject) => {
		axios.post(location.origin + '/.netlify/functions/proxy-status', {
				source: url,
				headers: headers
			})
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error)
			})
	});
}
