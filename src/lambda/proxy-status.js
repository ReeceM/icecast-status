const axios = require('axios');

export async function handler(event, context) {
	console.log(event);

	return {
		statusCode: 200,
		body: JSON.stringify({hello: "World"})
	}
	// try {
	// 	let decoded = JSON.parse(event.body);
	// 	let requestedUrl = decoded.source;
	// 	const response = await axios.get(requestedUrl);

	// 	return {
	// 		statusCode: 200,
	// 		body: JSON.stringify(response.json())
	// 	}
	// } catch (error) {
	// 	return {
	// 		statusCode: error.statusCode,
	// 		body: JSON.stringify(error)
	// 	}
	// }
}
