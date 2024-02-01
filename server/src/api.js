import { CFG_EnvDir } from './cfg.js';
import { exec } from 'node:child_process';

const cmd_start=`tmux new-window -n e_pepe -c /home/usr10/devel/web/pa/x/env_pepe -e SALUDO="hola pepe"`
const cmd_start_dev=`tmux send -t e_pepe "npm run dev --host 0.0.0.0" Enter`
const cmd_capture_dev=`tmux capture-pane -t e_pepe -p`

const cmd_query=`tmux list-windows -F "#{window_name} : #{window_index}"`

export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function exec_a(cmd) {
	return new Promise( (onOk, onErr) => {
		exec(cmd, (err, stdout, stderr) => {
			console.log("exec_a",{cmd,stdout,stderr})
			if (err) onErr(err)
			else onOk({stdout,stderr})
		})
	})
}

export async function env_is_runningP(env_name) {
	const { stdout } = await exec_a(cmd_query)
	return (stdout.indexOf(`e_${env_name} :`)>-1) //XXX: coordinar formato arriba!
}

const ENV_URL={};
export async function env_ensure_is_running(env_name, wantsForce) {
	//XXX:restart this server or dev
	if (wantsForce || !await env_is_runningP(env_name)) {
		ENV_URL[env_name]=null;
		await exec_a(cmd_start);
		await exec_a(cmd_start_dev);
		await delay(5000);
	}

	if (ENV_URL[env_name]==null) {
		const {stdout}= await exec_a(cmd_capture_dev);
		const s= stdout.replace(/\n\n+/g,'');
		const m= s.match(/Network:\s+(https?:\S+)/); 
		console.log("env_ensure_is_running", m && m[1], s);
		ENV_URL[env_name]= m && m[1];
	}

	return ENV_URL[env_name];
}


export function pathsFromReq(req) {
	const env_name= req.params.env; //CHECK in envs, safe
	const file_path= req.params[0]; //CHECK safe
	const safe_path= `${CFG_EnvDir}/env_${env_name}/src/${file_path}`
	const is_dir= (file_path=='' || file_path.endsWith('/'))
	const r= {env_name, file_path, safe_path, is_dir}
	console.log("PATHS FROM REQ", req.method, r, req.params)
	return r;
}


