//INFO: our code server
export const host_base=`http://${location.host.replace(/:\d+/,'')}` //XXX:CFG
export const host_code=`${host_base}:3000` //XXX:CFG
export const host_vista=`${host_base}:5173` //XXX:conseguir de host_code

const file_read= async (envName,filePath) => {
	return await fetch(`${host_code}/src/${envName}/${filePath}`).then(res => res.json());
}

export const file_write= async (envName,filePath,src) => {
	await fetch(`${host_code}/src/${envName}/${filePath}`, { 
		method: "POST", headers: {"Content-type": "application/json"}, 
		body: JSON.stringify({src: code})
	});
}

