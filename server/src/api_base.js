//INFO: the API controls what to do with requests, but is webserver agnostic

import { writeFile, readFile } from 'node:fs/promises';
import glob from 'fast-glob';

import { CFG_EnvDir } from './cfg.js';

const cmd_start= ({env_name, port}) => `tmux new-window -n e_${env_name} -c /home/usr10/devel/web/pa/x/env_${env_name} -e PORT='${port}'`
const cmd_start_dev= ({env_name}) => `tmux send -t e_${env_name} 'npm run dev --host 0.0.0.0 --port $PORT' Enter`
const cmd_capture_dev= ({env_name}) => `tmux capture-pane -t e_${env_name} -p`

const cmd_query= () => `tmux list-windows -F "#{window_name} : #{window_index}"`

const ENV={};
const CFG_port_first=10000;

class ApiBase {
	//S: FILES { The core is we read and write SOME source code files
	pathsFromReq({env_name_UNSAFE, file_path_UNSAFE}) {
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

	async file_list(params) {
		const spec= this.pathsFromReq(params);
		return await glob(
			`**/*.{js,jsx,css,ts,tsx,php,py,html}`, //XXX:CFG //XXX:SEC
			{cwd: spec.safe_path}
		)
	}

	async file_read(params) {
		const spec= this.pathsFromReq(params);
		const r= {path: spec.file_path} 
		//XXX:FILTER by path!
		try {
			if (spec.is_dir) { r.files= await readdir( spec.safe_path, {}); } 
			else { r.src= await readFile( spec.safe_path, "utf8"); }
		} catch (ex) {
			r.error= `Can't read ${ex}`
		}
		return r;
	}

	async file_write(params) {
		const src= params.src
		const spec= this.pathsFromReq(params);
		const r= {path: spec.file_path} 

		if (spec.is_dir) { return { ...r, error: "Only files can be updated"} }
		else if (src==null) { return { ...r, error: "Source is null"} }

		//XXX:FILTER by path!
		//A: can write
		try {
			await writeFile(spec.safe_path, src, 'utf8');
			return { ...r, ok: 'saved', view_url: view_url }
		} catch (ex) {
			return { ...r, error: `Can't write ${err}`}
		}
	}
	//S: FILES }

	//S: SESSIONS { We create a tmux window and run "some program" to show the results of the edited files
	//XXX:SEC sanitize parameters!
	//XXX:GENERALIZE to any dev environment, e.g. cmd_start_dev could launch a docker instance
	//XXX:APP may use many ports, encode in "host name"

	async env_is_runningP(env) {
		const { stdout } = await exec_a(cmd_query(env))
		const q= `e_${env.env_name} :`
		const idx= (stdout+'').indexOf(q)
		//DBG: console.log("env_is_runningP",{idx,q,stdout})
		return (idx>-1) //XXX: coordinar formato arriba!
	}

	env_port_for(env_name) {
		return CFG_port_first + Object.keys(ENV).length; //XXX:simplify with a list
	}

	async env_ensure_is_running(env_name, wantsForce) {
		//DBG: console.log("env_ensure_is_running", {env_name, wantsForce});

		//XXX:restart this server or dev
		const env= ENV[env_name] || {env_name, port: env_port_for(env_name)}
		if (wantsForce || !await this.env_is_runningP(env)) {
			ENV[env_name]=null;
			await exec_a(cmd_start(env));
			await exec_a(cmd_start_dev(env));
			await delay(5000);
		}

		if (ENV[env_name]==null) {
			const {stdout}= await exec_a(cmd_capture_dev(env));
			const s= stdout.replace(/\n\n+/g,'');
			const m= s.match(/Network:\s+(https?:\S+)/); 
			console.log("env_ensure_is_running", m && m[1], s);
			ENV[env_name]= { ...env, url: m && m[1], }
		}

		return ENV[env_name];
	}

	async env_app_url({env_name_UNSAFE}) {
		const spec= pathsFromReq({env_name_UNSAFE, file_path_UNSAFE: ''})
		return ENV[spec.env_name]?.url
	}

	//S: SESSIONS }

}

export function createApiInstance() { return new ApiBase() }
