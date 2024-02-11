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

export const setConfig = async (tokenText) => {
	try { tokenText= atob(tokenText) }
	catch (ex) {} //A: handled below
	try { 
		const token_cfg= JSON.parse(tokenText); 
		//XXX:validate with server!
		Object.assign(CFG, cfgApplyDefaults(), token_cfg);
		console.log("CFG", CFG);
	} catch (ex) {
		throw new Error('Please check you copied all the characters','error','Invalid token');
	}
}

export const url_live= async (envName) => {
	envName= envName || CFG.env_name_dflt;
	return CFG.url_live || CFG.url_code.replace('://',`://env_${envName}.`); 
}

export const file_list= async (envName) => {
	envName= envName || CFG.env_name_dflt;
	const r= await fetch(`${CFG.url_code}/src/${envName}/*`).then( res => res.json());
	if (r.error) throw new Error(r.error);
	return r;
}

export const file_read= async (envName,filePath) => {
	envName= envName || CFG.env_name_dflt;
	const r= await fetch(`${CFG.url_code}/src/${envName}/${filePath}`).then(res => res.json());
	if (r.error) throw new Error(r.error);
	return r;
}

export const file_write= async (envName,filePath,src) => {
	envName= envName || CFG.env_name_dflt;
	const r= await fetch(`${CFG.url_code}/src/${envName}/${filePath}`, { 
		method: "POST", headers: {"Content-type": "application/json"}, 
		body: JSON.stringify({src})
	}).then(res => res.json());
	console.log("XXX",r,r.error,r.error!=null);
	if (r.error) throw new Error(r.error);
	return r;
}

