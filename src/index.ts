import * as Fastify from 'fastify'

const server = Fastify.fastify({
	logger: true,
	trustProxy: [
		'127.0.0.1', '::1'
	],
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

server.get('/404', async (request, reply) => {
	reply
		.code(404)
		.type('text/html; charset=utf-8')
		.header('Cache-Control', 'private, max-age=0')
		.send(`404`);
});

server.get('/503', async (request, reply) => {
	reply
		.code(503)
		.type('text/html; charset=utf-8')
		.header('Cache-Control', 'private, max-age=0')
		.send(`503`);
});

server.get('/slow', async (request, reply) => {
	console.log(`SLOW_START: ${request.id} ${request.ip} ${request.method} ${request.headers['user-agent']}`);
	await sleep(15 * 1000);
	reply
		.code(200)
		.type('text/html; charset=utf-8')
		.header('Cache-Control', 'private, max-age=0')
		.send(`<html><head><meta charset=utf-8><title>OK</title></head><body>OK</body></html>`);
});

const port = process.env.PORT ? Number(process.env.PORT) : 3333;

server.listen(port, '0.0.0.0', (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
});
