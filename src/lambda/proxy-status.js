const axios = require('axios');

export async function handler(event, context) {
	let decoded = JSON.parse(event.body);
	let requestedUrl = decoded.source;

	try {
		const response = await axios.get(requestedUrl);

		return {
			statusCode: 200,
			body: JSON.stringify(response.json())
		}
	} catch (error) {
		return {
			statusCode: error.statusCode,
			body: "unable to fetch data"
		}
	}
}
