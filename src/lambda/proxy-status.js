const axios = require('axios');

export async function handler(event, context) {
	// Only allow POST
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Function not found..." };
	}

	let decoded = JSON.parse(event.body);
	let requestedUrl = decoded.source;

	if (!requestedUrl) {
		return { statusCode: 402, body: "Missing Parameters" };
	}

	try {
		const response = await axios.get(requestedUrl);
		const icestats = response.data || {};

		return {
			statusCode: 200,
			body: JSON.stringify(icestats)
		}

	} catch (error) {
		console.error(error);

		return {
			statusCode: 500,
			body: JSON.stringify({error: error})
		}
	}
}
