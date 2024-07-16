// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API Title',
			version: '1.0.0',
			description: 'A description of  API'
		},
		servers: [
			{
				url: 'http://localhost:5000/api/v1',
				description: 'Development server'
			},
		]
	},
	apis: ['./Documentations/*.txt'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
	swaggerUi,
	specs
};
