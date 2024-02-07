//INFO: our code server
export const host_base=location.host.replace(/:\d+/,'')
export const url_base=`${location.protocol}//${host_base}` //XXX:CFG
export const url_code= host_base=='localhost' ? `${url_base}:3000` : url_base //XXX:CFG
console.log("codeapi",{host_base,url_base,url_code})

export const url_vista= async (envName) => {
	return url_code.replace('://',`://env_${envName}.`); 
}

export const file_list= async (envName) => {
	return await fetch(`${url_code}/src/${envName}/*`).then(r => r.json())
}

export const file_read= async (envName,filePath) => {
	return await fetch(`${url_code}/src/${envName}/${filePath}`).then(res => res.json());
}

export const file_write= async (envName,filePath,src) => {
	await fetch(`${url_code}/src/${envName}/${filePath}`, { 
		method: "POST", headers: {"Content-type": "application/json"}, 
		body: JSON.stringify({src})
	});
}

