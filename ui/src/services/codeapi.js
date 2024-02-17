//INFO: our code server

const cfgApplyDefaults = (host_base) => {
	host_base= host_base || location.host.replace(/:\d+/,'') ;
	const url_base= `${location.protocol}//${host_base}`
	return { 
		host_base, 
		url_base,
		url_code: host_base=='localhost' ? `${url_base}:3000` : url_base ,
		env_name_dflt: 'dflt',
	}
}

const CFG= cfgApplyDefaults(); //DFLT, modified by setConfig

export const setConfig = async (cfg_kv) => {
	try { 
		//XXX:validate with server!
		Object.assign(CFG, cfgApplyDefaults(), cfg_kv);
		console.log("CFG", CFG);
	} catch (ex) {
		throw new Error('Please check you copied all the characters','error','Invalid token');
	}
}

export const url_live= async (envName) => {
	envName= envName || CFG.env_name_dflt;
	const r= await fetch(`${CFG.url_code}/proxy/${envName}/`, {method: 'POST', headers: {"Authorization": `Bearer ${CFG.token}`}}).then( res => res.json());
	const url_base= (CFG.url_live || CFG.url_code.replace('://',`://env_${envName}.`)); 
	return `${url_base}/_code_editing_connect_/${r.proxy_token}`
}

export const file_list= async (envName) => {
	envName= envName || CFG.env_name_dflt;
	const r= await fetch(`${CFG.url_code}/src/${envName}/*`, {headers: {"Authorization": `Bearer ${CFG.token}`}}).then( res => res.json());
	if (r.error) throw new Error(r.error);
	return r;
}

export const file_read= async (envName,filePath) => {
	envName= envName || CFG.env_name_dflt;
	const r= await fetch(`${CFG.url_code}/src/${envName}/${filePath}`, {headers: {"Authorization": `Bearer ${CFG.token}`}}).then(res => res.json());
	if (r.error) throw new Error(r.error);
	return r;
}

export const file_write= async (envName,filePath,src) => {
	envName= envName || CFG.env_name_dflt;
	const r= await fetch(`${CFG.url_code}/src/${envName}/${filePath}`, { 
		method: "POST", headers: {"Content-type": "application/json", "Authorization": `Bearer ${CFG.token}`}, 
		body: JSON.stringify({src})
	}).then(res => res.json());
	console.log("XXX",r,r.error,r.error!=null);
	if (r.error) throw new Error(r.error);
	return r;
}

