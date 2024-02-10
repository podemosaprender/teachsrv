//INFO: CodeEditingServer: static ui, editing files, proxy to GUEST application
//A: we add handlers to the express app, the order is relevant: the first succeeding ends the chain

const CFG_API_JS_PATH= process.argv[2] || process.env.API_JS_PATH || './api_base.js';
console.log('API, loading from', CFG_API_JS_PATH);
const { createApiInstance }= await import(CFG_API_JS_PATH);
const api= createApiInstance();

const CFG_LISTEN_PORT= process.env.P_NET_GUEST_PORT0 || 3000;
const CFG_LISTEN_INTERFACES= process.env.P_NET_INTERFACES || '0.0.0.0'; //SEC:ALL as default?

import { dir_for_this_script } from './lib.js';
const CFG_STATIC_PATH= dir_for_this_script()+'/static_ui_generated'; //XXX:CFG
const CFG_RESULT_DOMAIN_PFX= 'env_';
console.log('CFG_STATIC_PATH', CFG_STATIC_PATH);

import express from 'express';
import cors from 'cors';
import HttpProxy from 'http-proxy';


const proxy= HttpProxy.createProxyServer({});

const app = express();
const server = app.listen(CFG_LISTEN_PORT, CFG_LISTEN_INTERFACES);
console.log("SERVER LISTENING ON", `${CFG_LISTEN_INTERFACES} e.g. http://localhost:${CFG_LISTEN_PORT}`)

app.use(cors()); //XXX:SEC:limitar!

//S: PROXY {
async function proxy_to_urlP(req, protocol) { //U: return a url to proxy to OR null if must not be proxied
	let proxy_to_url= null; //DFLT

	/* req.headers includes
	 host: 'st1.test1.podemosaprender.org',
  'x-forwarded-host': 'st1.test1.podemosaprender.org',
  'forwarded-request-uri': '/src/pepe/App.jsx',
	*/
	const host= req.headers.host;
	if (host.startsWith(CFG_RESULT_DOMAIN_PFX)) { 
		const env_name_UNSAFE= host.split('.')[0].slice(CFG_RESULT_DOMAIN_PFX.length)
		proxy_to_url= await api.env_app_url({env_name_UNSAFE});
		console.log("PROXY", {protocol, app_url, host, req_url: req.originalUrl});
	}

	return proxy_url;
}

app.use(async (req, res, next) => { //A: proxy calls to EditedApp(s) and dependencies
	const proxy_to_url= await proxy_to_urlP(req,'HTTP*');
	if (proxy_to_url) { proxy.web(req, res, { target: proxy_to_url}) } //A: api says "proxy to this url"
	else { next() }
});

server.on('upgrade', async (req, socket, head) => { //A: proxy calls to EditedApp(s) and dependencies (WebSockets)
	const proxy_to_url= await proxy_to_urlP(req,'HTTP*');
	if (proxy_to_url) { proxy.ws(req, socket, head,{ target: proxy_to_url}) }	//A: api says "proxy to this url"	
	else { next() }
});
//S: PROXY }

app.use(express.static(CFG_STATIC_PATH)); //A: serve CodeEditingUI 

//A: request WASN'T handled by calling a proxy

app.use(express.json());

//S: EDITING FILE SERVER {
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
//S: EDITING FILE SERVER }

//S: EDITING COMMANDS {
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
//S: EDITING COMMANDS }

