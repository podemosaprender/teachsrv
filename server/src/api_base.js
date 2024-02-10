//INFO: the API controls what to do with requests, but is webserver agnostic

import { writeFile, readFile } from 'node:fs/promises';
import glob from 'fast-glob';

import { CFG_EnvDir } from './cfg.js';
const CFG_EDITED_APP_DOMAIN_PFX= 'env_';

class ApiBase {
	//S: EDITED_FILES { The core is we read and write SOME source code files

	_pathsFromReq({env_name_UNSAFE, file_path_UNSAFE}) { //U: get SAFE paths from request=UNSAFE environment name and path
		const env_name= env_name_UNSAFE.replace(/[^a-z\d]/gi,''); //XXX:SEC allowed? 
		const file_path= file_path_UNSAFE
			.replace(/^[^a-z0-9_]*/gi,'') //A: starts with letter, number or _a (NOT "-" as may be interpreted as parameter)
			.replace(/[^-_\/\.a-z0-9]*/gi,'') //A: only safe characters

		const safe_path= `${CFG_EnvDir}/env_${env_name}/src/${file_path}` //XXX:CFG
		const is_dir= (file_path=='' || file_path.endsWith('/'))
		const r= {env_name, file_path, safe_path, is_dir}
		console.log("PATHS FROM REQ", r, {env_name_UNSAFE, file_path_UNSAFE})
		return r;
	}

	async _file_whatsAllowed(path) { //U: return R for READ, W for READ+WRITE, '' to DENY even listing
		return "W"; //XXX:SEC //XXX:IMPLEMENT
	}

	async file_list(params) { //U: return a list of files that can be edited/viewed in this environment
		const spec= this._pathsFromReq(params);
		const paths= await glob(
			`**/*.{js,jsx,css,ts,tsx,php,py,html}`, //XXX:CFG //XXX:SEC //XXX:add "readonly"
			{cwd: spec.safe_path}
		)
		const r= {};
		await Promise.all(paths.forEach( p => { const a= await this._file_whatsAllowed(p); if (a) kv[p]= a; }))
		return r;
	}

	async file_read(params) { //U: return the content of a file that can be edited/viewed in this environment
		const spec= this._pathsFromReq(params);
		const r= {path: spec.file_path} 
		const a= await this._file_whatsAllowed(p);	
		if (a!='R' && a!='W') { r.error=`Not allowed` }
		else {
			try {
				if (spec.is_dir) { r.files= await readdir( spec.safe_path, {}); } 
				else { r.src= await readFile( spec.safe_path, "utf8"); }
			} catch (ex) {
				r.error= `Can't read ${ex}`
			}
		}
		return r;
	}

	async file_write(params) {
		const src= params.src
		const spec= this._pathsFromReq(params);
		const r= {path: spec.file_path} 

		if (spec.is_dir) { return { ...r, error: "Only files can be updated"} }
		else if (src==null) { return { ...r, error: "Source is null"} }
		//A: not a dir, has src

		const a= await this._file_whatsAllowed(p);	
		if (a!='W') { r.error=`Not allowed` }
		else { //A: can write
			try {
				await writeFile(spec.safe_path, src, 'utf8');
				r.ok= 'saved'}
			} catch (ex) {
				r.error= `Can't write ${err}`
			}
		}
		return r;
	}
	//S: EDITED_FILES }

	//S: EDITED_APP { 
	async _env_proxy_url_for({env_name_UNSAFE}) {
		const spec= this._pathsFromReq({env_name_UNSAFE, file_path_UNSAFE: ''})
		return ENV[spec.env_name]?.url
	}

	async proxy_to_urlP(req, protocol) { //U: return a url to proxy to OR null if must not be proxied
		let proxy_to_url= null; //DFLT

		/* req.headers includes
		 host: 'st1.test1.podemosaprender.org',
		'x-forwarded-host': 'st1.test1.podemosaprender.org',
		'forwarded-request-uri': '/src/pepe/App.jsx',
		*/
		const host= req.headers.host;
		if (host.startsWith(CFG_EDITED_APP_DOMAIN_PFX)) { 
			const env_name_UNSAFE= host.split('.')[0].slice(CFG_EDITED_APP_DOMAIN_PFX.length)
			proxy_to_url= await this._env_proxy_url_for({env_name_UNSAFE});
			console.log("PROXY", {protocol, app_url, host, req_url: req.originalUrl});
		}

		return proxy_url;
	}
	//S: EDITED_APP }

	//S: OTHER COMMANDS {
	async env_commands({env_name_UNSAFE}) {
		return { 
			"file": {"delete": {path: ''}}, //U: Commands for files, name->message, etc.
			"env": { //U: Commands for the whole environment e.g. restarting the edited app, git commit, etc
				"ping": {}, //U: just an example
			}
		});
	}

	async env_command_execute({env_name_UNSAFE, data}) { //U: execute the requested command, CHECK for security!
		if (data.cmd=='ping') { return 'pong' } 
		throw new Error('Not alowed') 
	}
	//S: OTHER COMMANDS }
}

export function createApiInstance() { return new ApiBase() }
