//INFO: CodeEditingServer: static ui, editing files, proxy to GUEST application
//U: we add handlers to the express app, the order is relevant: the first succeeding ends the chain

const CFG_API_JS_PATH= process.argv[2] || process.env.API_JS_PATH || './api_base.js';
console.log('API, loading from', CFG_API_JS_PATH);
const { createApiInstance }= await import(CFG_API_JS_PATH);
const api= createApiInstance();
//A: we have the api that controls the EditedApp!

const CFG_LISTEN_PORT= process.env.P_NET_GUEST_PORT0 || 3000;
const CFG_LISTEN_INTERFACES= process.env.P_NET_INTERFACES || '0.0.0.0'; //SEC:ALL as default?
const CFG_API_PFX= ''; //U: to avoid clashes with EDITED_APP //XXX:IMPLEMENT

import { dir_for_this_script } from './lib.js';
const CFG_STATIC_PATH= dir_for_this_script()+'/static_ui_generated'; //XXX:CFG
console.log('CFG_STATIC_PATH', CFG_STATIC_PATH);

import express from 'express';
import cors from 'cors';
import HttpProxy from 'http-proxy';

const proxy= HttpProxy.createProxyServer({});

const app = express();
const server = app.listen(CFG_LISTEN_PORT, CFG_LISTEN_INTERFACES);
console.log("SERVER LISTENING ON", `${CFG_LISTEN_INTERFACES} e.g. http://localhost:${CFG_LISTEN_PORT}`)

app.use(cors()); //XXX:SEC:limitar!

//S: Token validation {

import fs from 'node:fs';

const CFG_TOKENS_JSON_PATH = process.env.CFG_TOKENS_JSON_PATH
const CFG_TOKENS_KV = CFG_TOKENS_JSON_PATH ? JSON.parse( fs.readFileSync(CFG_TOKENS_JSON_PATH,"utf8")) : {};

const CFG_TOKENS_KEY_PATH = process.env.CFG_TOKENS_KEY_PATH
const CFG_TOKENS_KEY = CFG_TOKENS_KEY_PATH ? fs.readFileSync(CFG_TOKENS_KEY_PATH,"utf8") : null;

const local_token_exists = async function(auth_token) {
	return CFG_TOKENS_KV[auth_token]
}

import jwt from 'jsonwebtoken';

function jwt_auth_is_valid(auth_token) {
	if (auth_token == null || CFG_TOKENS_KEY == null) return false;

	console.log(CFG_TOKENS_KEY)

	return new Promise( (onOk,onError) => {
		jwt.verify(auth_token, CFG_TOKENS_KEY, function(err, decoded) {
			if (err) { console.error("token", err); onError(err) }
			else { console.log("token",decoded); onOk(decoded) }
		})
	});
}

const validateTokenMiddleware = async function (req, res, next) {

	const auth_token = req.headers.authorization?.split("Bearer ")[1]

	console.log('validateTokenMiddleware', auth_token)

	try { if ( 
		auth_token && (
			(await local_token_exists(auth_token)) ||
			(await jwt_auth_is_valid(auth_token))
		)
	) {
		next();
		return;
	}; } catch (ex) {} //A: handled below

	//A: no valid token

	res.setHeader('Content-Type', 'application/json');
	const errorX = {error: "Token not valid."}
	res.status(401).send(errorX);
	
}
  
app.use(validateTokenMiddleware)

//S: Token validation }

//S: PROXY {
app.use(async (req, res, next) => { //A: proxy calls to EditedApp(s) and dependencies
	const proxy_to_url= await api.proxy_to_urlP(req,'HTTP*');
	if (proxy_to_url) { proxy.web(req, res, { target: proxy_to_url}) } //A: api says "proxy to this url"
	else { next() }
});

server.on('upgrade', async (req, socket, head) => { //A: proxy calls to EditedApp(s) and dependencies (WebSockets)
	const proxy_to_url= await api.proxy_to_urlP(req,'HTTP*');
	if (proxy_to_url) { proxy.ws(req, socket, head,{ target: proxy_to_url}) }	//A: api says "proxy to this url"	
	else { next() }
});
//S: PROXY }

app.use(express.static(CFG_STATIC_PATH)); //A: serve CodeEditingUI 

//A: request WASN'T handled by calling a proxy

app.use(express.json());

//S: EDITING FILE SERVER {
app.get(CFG_API_PFX+'/src/:env/*', async (req,res) => {
	const env_name_UNSAFE= req.params.env; 
	const file_path_UNSAFE= req.params[0]; 
	if (file_path_UNSAFE=='*') {
		res.json(await api.file_list({env_name_UNSAFE, file_path_UNSAFE}))
	} else {
		res.json(await api.file_read({env_name_UNSAFE, file_path_UNSAFE}))
	}
})

app.post(CFG_API_PFX+'/src/:env/*', async (req, res) => {
	const env_name_UNSAFE= req.params.env; 
	const file_path_UNSAFE= req.params[0]; 
	const src= req.body.src;
	res.json(await api.file_write({env_name_UNSAFE, file_path_UNSAFE, src}))
} );
//S: EDITING FILE SERVER }

//S: EDITING COMMANDS {
app.get(CFG_API_PFX+'/cmd/:env/*', async (req,res) => {
	const env_name_UNSAFE= req.params.env; 
	const file_path_UNSAFE= req.params[0]; 
	const r= await api.env_commands({env_name_UNSAFE,file_path_UNSAFE})
	res.json(r);
})

app.post(CFG_API_PFX+'/cmd/:env/*', async (req, res) => {
	const env_name_UNSAFE= req.params.env; 
	try {
		const r= await api.env_command_execute({env_name_UNSAFE,data:req.body})
		res.json(r);
	} catch (ex) { res.json({error: ex+''}); }
	res.json({error: 'not implemented'}); 
});
//S: EDITING COMMANDS }

