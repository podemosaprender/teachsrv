import React, { useState, useEffect } from 'react';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

import { enc_b64url, enc_b64url_r } from '../rte/util/b64url';
import { paramsFromURL } from '../rte/util/urlparams';
import { getTokenFromDocLocation } from '../services/loginapi';

const DEFAULT_CONFIG= {
	"DOC0": "Replace all this with the token you received",
	"DOC1": "If you are just testing (no token) press [Login], reload to come back here.",
	"DOC2": "You may wan't to play with the urls in the next values too",
	"DOC3": "use the browser network console to see what happens",
	"url_live": "http://live.localhost:3000",
	"url_code": "http://localhost:3000",
	"needs_login_at": "https://api1.o-o.fyi/auth/login?scope=editor&redirect_uri={{my_uri}}&extra_data={{cfg}}",
	"needs_claim_at": "https://api1.o-o.fyi/auth/token/claim"
}

export function LoginPage({setConfig}) {
	const [ cfgStr, setCfgStr ]= useState('');
	const [ cfgURL, setCfgURL ]= useState('');

	useEffect(() => { 
		const discoverStatus= async () => {
			const tkSts= await getTokenFromDocLocation();
			if (tkSts) { //A: returns from OAuth, we got a code and claimed a token
				const cfg= {...tkSts[1].not_validated, token: tkSts[0]}; //XXX:make compatible with other OAuth2
				setCfgStr( JSON.stringify(cfg, null, 2) ); 
			} else {
				const params= paramsFromURL()
				let s= params.get('cfg'); try { s= enc_b64url_r(s) } catch(ex) {} //A: just try
				setCfgStr(s || JSON.stringify(DEFAULT_CONFIG,0,2) )
			}
		};
		discoverStatus();
	},[]);

	const my_uri=	location.href.replace(/[?\#].*$/,'');
	const onCfgStrChange = (e) => {
		const s= e.target.value;
		setCfgStr(s);
		setCfgURL(my_uri+'?cfg='+(s.match(/[^\w]/) ? enc_b64url(s) : s))
	}

	const onLoginBtn= () => {
		let dec= cfgStr; try { dec= enc_b64url_r(cfgStr) } catch (ex) {}; //A: just try!
		let d= dec; try { d= JSON.parse(dec); } catch (ex) {}; //A: just try!
		//DBG: console.log("LoginData",typeof(d),d);

		if (d!=null) {
			if (typeof(d)=="object") {
				if (d.needs_login_at) {
					const cfg_clean= {...d}; delete cfg_clean.needs_login_at;	
					const claim_url= d.needs_claim_at || d.needs_login_at.match(/https?:\/\/[^\/]+/)[0];
					const url= (
						d.needs_login_at
						.replace('{{my_uri}}',encodeURIComponent(my_uri))
						.replace('{{cfg}}',encodeURIComponent(JSON.stringify(cfg_clean)))
						+ '&state='+encodeURIComponent(claim_url)
					);
					if (confirm(`You will be redirected to login at ${url.slice(0,100)}...`)) {
						location.href= url; //A:NAVIGATE!
					}
				} else {
					const cfg= {
						...DEFAULT_CONFIG, 
						...( d.not_validated ? { ...d.not_validated, token: XXX} : d)
					}
					setConfig(cfg);
				}
			} else { //A: just an opaque token
				if (!d.match(/[{}\":]/) || !confirm("Check if you pasted the config correctly?")) {
					const cfg= {...DEFAULT_CONFIG, token: d}
					setConfig(cfg);
				}
			}
		}
	}

	return (<>
		<h3>Paste the token you received</h3>
		<div>
		<InputTextarea 
			value={cfgStr} onChange={onCfgStrChange}
			style={{width: '95vw', height: '50vh'}}	
		/>
		</div>
		<div className="flex flex-columns gap-1 m-2">
			<Button label="Continue" onClick={onLoginBtn} />
			<a className="p-button p-button-outlined font-bold" href={cfgURL} target="_blank">share config</a>
		</div>
	</>)
}
