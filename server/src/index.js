//S: server

/* U: para que estudiantes accedan via pepe.test1.podemosaprender.org
 * abro tunel con # ssh -i ~/***REMOVED*** -R 13215:localhost:3000 -o ServerAliveInterval=3 ***REMOVED***@podemosaprender.org
 * 13215 es el puerto de mi app "nginx only port" en opalstack
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

app.get('/src/:env/*', (req,res) => {
	const spec= api.pathsFromReq(req);
	const r= {path: spec.file_path} 
	if (spec.is_dir) {
		fs.readdir( spec.safe_path, {}, (err, files) => { res.json({ ...r, files}); })
	} else {
		fs.readFile( spec.safe_path, "utf8", (err, src) => { res.json({ ...r, src}); })
	}
})

app.post('/src/:env/*', async (req, res) => {
	const spec= api.pathsFromReq(req);
	const r= {path: spec.file_path} 
	const src= req.body.src;

	if (spec.is_dir) { res.json({ ...r, error: "Only files can be updated"}) }
	else if (src==null) { res.json({ ...r, error: "Source is null"}) }
	else { 
		const view_url= await api.env_ensure_is_running(spec.env_name);
		fs.writeFile(spec.safe_path, src, 'utf8', (err, ok) => {
			if (err) { res.json({ ...r, error: `Can't write ${err}`}); }
			else { res.json({ ...r, ok: 'saved', view_url: view_url }) }
		});
	}

});

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
