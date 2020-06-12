export function proxy(url, headers = {}) {
	return new Promise((resolve, reject) => {
		axios.post(location.origin + '/.netlify/functions/proxy-status', {
				source: url,
				headers: headers
			})
			.then(({
				data
			}) => {
				resolve(data);
			})
			.catch(error => {
				reject(error)
			})
	});
}
