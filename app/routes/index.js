'use strict';

const path = process.cwd();

module.exports = function (app, passport, User, SrvInfo, DataInit) { // eslint-disable-line no-unused-vars

/*
*	check if data init is needed
*	data is initialized with dummy data if the DB is empty on server start
*/

	DataInit.initData();

/*
*	routes
*/

	app.get('/', (req, res) => {
		res.sendFile(path + '/public/index.html');
	});

	app.get('/dummy', (req, res) => {
		const headers = req.headers;
		console.log('headers', headers);
		const output = [{key: 'Success', y:1}];

		res.format({
			'application/json': function(){
				res.send(output);
			}
		});
	});
	
	app.get('/users', (req, res) => {
		User.find({}, (err, docs) => {
			if (err) { throw err; }
			console.log('users list', docs);
			let resData = [],
				dataUnit = {};
			for (let i in docs) {
				if (docs[i]) {
					dataUnit = {
						id: docs[i].id,
						role:	docs[i].role,
						registered:	docs[i].registered,
						lastLogin: docs[i].lastLogin,
						email: docs[i].userExtended.email,
						firstName: docs[i].userExtended.firstName,
						lastName: docs[i].userExtended.lastName,
						city: docs[i].userExtended.city,
						country: docs[i].userExtended.country
					};
					resData.push(dataUnit);
				}
			}
			res.setHeader('Cache-Control', 'no-cache, no-store');
			res.format({
				'application/json': function(){
					res.send(resData);
				}
			});
		});
	});

	app.get('/app-diag/usage', (req, res) => {
		User.find({}, (err, docs) => {
			if (err) { throw err; }
			console.log('count list', docs.length);
			let stats = [
				{ key: 'Users', y: 0},
				{ key: 'Admins', y: 0}
			];
			for (let i in docs) {
				if (docs[i]) {
					if (docs[i].role === 'admin') stats[1].y++;
					else stats[0].y++;
				}
			}
			res.setHeader('Cache-Control', 'no-cache, no-store');
			res.format({
				'application/json': function(){
					res.send(stats);
				}
			});
		});
	});

	app.get('/app-diag/static', (req, res) => {
		res.setHeader('Cache-Control', 'no-cache, no-store');
		res.format({
			'application/json': function(){
				res.send(SrvInfo['static']());
			}
		});
	});

	app.ws('/app-diag/dynamic', (ws) => {
		console.log('websocket opened /app-diag/dynamic');
		let sender = null;
		ws.on('message', (msg) => {
			console.log('message:',msg);
			function sendData () {
				ws.send(JSON.stringify(SrvInfo['dynamic']()), (err) => {if (err) throw err;});
			}
			if (JSON.parse(msg).action === 'get') {
				console.log('ws open, data sending started');
				sendData();
				sender = setInterval(() => {
					sendData();
				}, 5000);
			}
			if (JSON.parse(msg).action === 'pause') {
				console.log('ws open, data sending paused');
				clearInterval(sender);
			}
		});
		ws.on('close', () => {
			console.log('Persistent websocket: Client disconnected.');
			if (ws._socket) {
				ws._socket.setKeepAlive(true);
			}
			clearInterval(sender);
		});
		ws.on('error', () => {console.log('Persistent websocket: ERROR');});
	});
};
