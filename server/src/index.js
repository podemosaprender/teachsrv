//S: server

/* U: para que estudiantes accedan via pepe.test1.podemosaprender.org
 * abro tunel con # ssh -i *YOUR_KEY* -R 13215:localhost:3000 -o ServerAliveInterval=3 *YOUR_USER*@podemosaprender.org
 * 13215 es el puerto de mi app "nginx only port" en el hosting
 */
//XXX:LIB {
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);
//XXX:LIB }

const STATIC_PATH= __dirname+'/static_ui_generated';
console.log('STATIC_PATH', STATIC_PATH);

import express from 'express';
import cors from 'cors';
import HttpProxy from 'http-proxy';

import * as api from './api.js';

const proxy= HttpProxy.createProxyServer({});

const app = express();
const server = app.listen(process.env.GUEST_PORT || 3000,'0.0.0.0'); //XXX:sec, all?
app.use(cors()); //XXX:SEC:limitar!

//S: PROXY {
app.use(async (req, res, next) => { //A: proxy other calls to controlled app servers
	/* req.headers includes
	 host: 'st1.test1.podemosaprender.org',
  'x-forwarded-host': 'st1.test1.podemosaprender.org',
  'forwarded-request-uri': '/src/pepe/App.jsx',
	*/
	const host= req.headers.host;
	if (host.startsWith('env_')) {
		const env_name_UNSAFE= host.replace(/^env_/,'').split('.')[0];
		let app_url= await api.env_app_url({env_name_UNSAFE});
		console.log("PROXY", {app_url, host, req_url: req.originalUrl});
		app_url= app_url || 'http://localhost:10000'; //XXX
		if (app_url) {
			proxy.web(req, res, { target: app_url}) 
		}
	} else { next() }
});

server.on('upgrade', async (req, socket, head) => { //A: proxy other calls to controlled app WebSocket servers
	const host= req.headers.host;
	if (host.startsWith('env_')) {
		const env_name_UNSAFE= host.replace(/^env_/,'').split('.')[0];
		const app_url= await api.env_app_url({env_name_UNSAFE});
		console.log("PROXY WS", {app_url, host, req_url: req.originalUrl});
		if (app_url) {
			proxy.ws(req, socket, head,{ target: app_url}) 
		}			
	} else { next() }
});
//S: PROXY }

app.use(express.static(STATIC_PATH));

//A: request WASN'T handled by calling a proxy
app.use(express.json());
//S: FILE SERVER {
app.get('/src/:env/*', async (req,res) => {
	const env_name_UNSAFE= req.params.env; 
	const file_path_UNSAFE= req.params[0]; 
	if (file_path_UNSAFE=='*') {
		res.json(await api.file_list({env_name_UNSAFE, file_path_UNSAFE}))
	} else {
		res.json(await api.file_read({env_name_UNSAFE, file_path_UNSAFE}))
	}
})

app.post('/src/:env/*', async (req, res) => {
	const env_name_UNSAFE= req.params.env; 
	const file_path_UNSAFE= req.params[0]; 
	const src= req.body.src;
	res.json(await api.file_write({env_name_UNSAFE, file_path_UNSAFE, src}))
} );
//S: FILE SERVER }

//S: COMMANDS {
app.get('/cmd/:env/*', async (req,res) => {
	res.json({ //XXX:to config
		"file": {
			"git add": {},
			"delete": {},
		},
		"env": {
			"git commit": {},
			"git push": {},
		}
	});
})

app.post('/cmd/:env/*', async (req, res) => {
	res.json({error: 'not implemented'}); //XXX:implement
});
//S: COMMANDS }

console.log("SERVER LISTENING ON", process.env.GUEST_PORT)
