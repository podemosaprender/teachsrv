import path from 'path';
import {fileURLToPath} from 'url';
export function dir_for_this_script(aImportMeta) { //U: the dir where the calling script is located
	aImportMeta= aImportMeta  || import.meta ;
	const __filename = fileURLToPath(aImportMeta.url);
	const __dirname = path.dirname(__filename);
	return __dirname+'';
}

export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

import { exec } from 'node:child_process';
export function exec_a(cmd) {
	return new Promise( (onOk, onErr) => {
		exec(cmd, (err, stdout, stderr) => {
			//DBG: console.log("exec_a",{cmd,stdout,stderr})
			if (err) onErr(err)
			else onOk({stdout,stderr})
		})
	})
}

