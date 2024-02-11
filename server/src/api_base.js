//INFO: the API controls what to do with requests, but is webserver agnostic

import { writeFile, readFile } from 'node:fs/promises';
import glob from 'fast-glob';
import micromatch from 'micromatch';

const CFG_FILE_PATH= process.env.ENV || './config.json';
console.log("CONFIG READING FROM", CFG_FILE_PATH)
const CFG= {
	EditedApp_SingleBaseDir: null, //U: for a single EditedApp and environment
	EditedApp_MultiParentDir: '/tmp/x_edited_app', //U:SEC NEVER set to a dir containing files you don't want edited!
	EditedApp_FileListGlob: '**/*.{js,jsx,css,ts,tsx,php,py,html}', //U: all files that must be offered for edit/read
	EditedApp_FileFilterGlobs: { '*': 'W' }, //U: globs -> R|W|DENY globs will be tried in order until an R,W or DENY
	EditedApp_Proxy_DomainRules: { //U: regex -> full url ($1, ...$9) etc. will be replaced by captured groups)
		'^env_([^\.]+)': 'ASK',
	}
}

try { 
	Object.assign(CFG, JSON.parse( await readFile( CFG_FILE_PATH ) ) );
	console.log("CFG READ", CFG_FILE_PATH, CFG);
} catch (ex) {
	console.error("CFG reading", CFG_FILE_PATH, ex);
	process.exit(1);
}
//A: CFG is ready

class ApiBase {
	//S: EDITED_FILES { The core is we read and write SOME source code files

	_proxyCache= {} //U: host -> proxy_to_url, react EditedApp makes a lot of requests

	_pathsFromReq({env_name_UNSAFE, file_path_UNSAFE}) { //U: get SAFE paths from request=UNSAFE environment name and path
		const env_name= env_name_UNSAFE.replace(/[^a-z\d]/gi,''); //XXX:SEC allowed? 
		const file_path= file_path_UNSAFE
			.replace(/^[^a-z0-9_]*/gi,'') //A: starts with letter, number or _a (NOT "-" as may be interpreted as parameter)
			.replace(/[^-_\/\.a-z0-9]*/gi,'') //A: only safe characters

		const safe_base_path= CFG.EditedApp_SingleBaseDir || `${CFG.EditedApp_MultiParentDir}/env_${env_name}/src`;
		const safe_path= `${safe_base_path}/${file_path}`
		const is_dir= (file_path=='' || file_path.endsWith('/'))
		const r= {env_name, file_path, safe_path, is_dir}
		console.log("PATHS FROM REQ", r, {env_name_UNSAFE, file_path_UNSAFE})
		return r;
	}

	async _file_whatsAllowed(path) { //U: return R for READ, W for READ+WRITE, '' to DENY even listing
		const match= Object.entries( CFG.EditedApp_FileFilterGlobs ).find( 
			([glob, permissions]) => micromatch.isMatch(path, glob)
		);
		const [why_glob, why_perm]= match || ['NONE','DENY'];
		console.log(`FILE ALLOWING ${why_perm||'NOTHING'} for ${path} because ${why_glob}`);
		return why_perm;
	}

	async file_list(params) { //U: return a list of files that can be edited/viewed in this environment
		const spec= this._pathsFromReq(params);
		const paths= await glob(
			CFG.EditedApp_FileListGlob,	
			{cwd: spec.safe_path}
		)
		const r= {};
		await Promise.all(paths.map( async p => { const a= await this._file_whatsAllowed(p); if (a) r[p]= a; }))
		return r;
	}

	async file_read(params) { //U: return the content of a file that can be edited/viewed in this environment
		const spec= this._pathsFromReq(params);
		const r= {path: spec.file_path} 
		const a= await this._file_whatsAllowed(spec.file_path);	
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

		const a= await this._file_whatsAllowed(spec.file_path);	
		if (a!='W') { r.error=`Not allowed` }
		else { //A: can write
			try {
				await writeFile(spec.safe_path, src, 'utf8');
				r.ok= 'saved'
			} catch (ex) {
				r.error= `Can't write`
				console.log(`FILE ERROR WRITING ${spec.safe_path} ${ex}`);
			}
		}
		return r;
	}
	//S: EDITED_FILES }

	//S: EDITED_APP { 
	async proxy_to_urlP(req, protocol) { //U: return a url to proxy to OR null if must not be proxied
		/* req.headers includes
		 host: 'st1.test1.podemosaprender.org',
		'x-forwarded-host': 'st1.test1.podemosaprender.org',
		'forwarded-request-uri': '/src/pepe/App.jsx',
		*/
		const host= req.headers.host;
		let proxy_to_url= this._proxyCache[host];
		if (proxy_to_url==null) {
			let match_groups;
			const match_rule = Object.entries( CFG.EditedApp_Proxy_DomainRules ).find(
				([ regex_pattern, result_pattern ]) => (match_groups= host.match(new RegExp(regex_pattern)))
			);
			if (match_groups) {
				const result_pattern= match_rule[1];
				proxy_to_url= result_pattern.replace(/\$[0-9]/g, (idx) => match_groups[idx]);
				console.log("PROXY",{host,proxy_to_url,match_rule});
			}
			if (proxy_to_url!="NO:IGNORE") { //A: put first a rule can return NO:IGNORE to not even cache the result
				this._proxyCache[ host ]= proxy_to_url;
			}
		}
		return (proxy_to_url && !proxy_to_url.startsWith('NO:')) ?  proxy_to_url : null; 
	}
	//S: EDITED_APP }

	//S: OTHER COMMANDS {
	async env_commands({env_name_UNSAFE}) {
		return { 
			"file": {"delete": {path: ''}}, //U: Commands for files, name->message, etc.
			"env": { //U: Commands for the whole environment e.g. restarting the edited app, git commit, etc
				"ping": {}, //U: just an example
			}
		};
	}

	async env_command_execute({env_name_UNSAFE, data}) { //U: execute the requested command, CHECK for security!
		if (data.cmd=='ping') { return 'pong' } 
		throw new Error('Not alowed') 
	}
	//S: OTHER COMMANDS }
}

export function createApiInstance() { return new ApiBase() }
