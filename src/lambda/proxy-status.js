// const axios = require('axios');
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello world ${Math.floor(Math.random() * 10)}` })
  };
}
// exports.handler = function (event, context, callback) {
// 	/.netlify/functions/hello
// 	// let decoded = JSON.parse(event.body);
// 	// let requestedUrl = decoded.url;

// 	// axios.get(requestedUrl)
// 	// 	.then((response) => {
// 	// 		callback(null, {
// 	// 			statusCode: response.statusCode,
// 	// 			headers: response.headers,
// 	// 			body: JSON.stringify(response.data)
// 	// 		});
// 	// 	})
// 	// 	.catch(error => {
// 	// 		callback(null, {
// 	// 			statusCode: error.statusCode,
// 	// 			headers: {
// 	// 				'Content-Type': error.headers.get
// 	// 			},
// 	// 			body: 'Unable to fetch data for the response'
// 	// 		})
// 	// 	})
// }
