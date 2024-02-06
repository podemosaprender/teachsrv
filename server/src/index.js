//S: server

/* U: para que estudiantes accedan via pepe.test1.podemosaprender.org
 * abro tunel con # ssh -i *YOUR_KEY* -R 13215:localhost:3000 -o ServerAliveInterval=3 *YOUR_USER*@podemosaprender.org
 * 13215 es el puerto de mi app "nginx only port" en el hosting
 */

import fs from 'fs';
import express from 'express';
import cors from 'cors';
import HttpProxy from 'http-proxy';

import * as api from './api.js';

const proxy= HttpProxy.createProxyServer({});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/src/:env/*', async (req,res) => {
	res.json(await api.file_read(req))
})

app.post('/src/:env/*', async (req, res) => {
	res.json(await api.file_write(req))
} );

app.use((req, res, next) => {
	/* req.headers includes
	 host: 'st1.test1.podemosaprender.org',
  'x-forwarded-host': 'st1.test1.podemosaprender.org',
  'forwarded-request-uri': '/src/pepe/App.jsx',
	*/
	const host= req.headers.host;
	console.log("PROXY", host, req.originalUrl);
	proxy.web(req, res, { target: 'http://localhost:5173'}) //XXX:get url for student from api
});

const server = app.listen(3000,'0.0.0.0'); //XXX:sec, all?

server.on('upgrade', (req, socket, head) => {
	proxy.ws(req, socket, head,{ target: 'http://localhost:5173'}) //XXX:get url for student from api
});
