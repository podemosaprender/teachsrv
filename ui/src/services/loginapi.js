//INFO: retrieve token from PodemosAprender API

import { jwtDecode } from 'jwt-decode';
import { paramsFromURL } from '../rte/util/urlparams';

export async function getTokenUsingCode(code, claim_url) {
	//DBG: console.log('token: claiming with code', code);
	let tk= await fetch(claim_url ,{ 
		method: 'POST', headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({code}),
	}).then(res => res.text())
	tk= tk.replace(/"/g,'').replace(/"$/,''); //XXX:clean/find inside JSON, etc.
	//DBG: 
	console.log('token: got',tk)
	const tk_data= jwtDecode(tk);
	//DBG: console.log('token data:',tk_data);
	return [tk, tk_data];
}

export async function getTokenFromDocLocation() {
	let r= null;
	const params= paramsFromURL()
	if (params.has('code')) {
		r= await getTokenUsingCode(params.get('code'), params.get('state')); //A: login page sets state to claim url
		window.history.replaceState(null,null,location.href.replace(/\?.*$/,'')) //A: clean URL
	}
	return r;
}

