//INFO: retrieve token from PodemosAprender API

import { jwtDecode } from 'jwt-decode';
import { paramsFromURL } from '../rte/util/urlparams';

const CLAIM_URL='http://localhost:8000/auth/token/claim'; //XXX:HARDCODED claim host!

export async function getTokenUsingCode(code) {
	//DBG: console.log('token: claiming with code', code);
	const tk= await fetch(CLAIM_URL ,{ 
		method: 'POST', headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({code}),
	}).then(res => res.text())
	//DBG: console.log('token: got',tk)
	const tk_data= jwtDecode(tk);
	//DBG: console.log('token data:',tk_data);
	return [tk, tk_data];
}

export async function getTokenFromDocLocation() {
	let r= null;
	const params= paramsFromURL()
	if (params.has('code')) {
		r= await getTokenUsingCode(params.get('code'));
		window.history.replaceState(null,null,location.href.replace(/\?.*$/,'')) //A: clean URL
	}
	return r;
}

