import React, { useState } from 'react';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const SAMPLE_CONFIG=`{
	"DOC0": "Replace all this with the token you received",
	"DOC1": "If just testing (no token) press [Login], reload to come back here.",
	"DOC2": "You may wan't to play with the urls in the next values too",
	"DOC3": "use the browser network console to see what happens",
	"url_live": "https://mauriciocap.com",
	"url_code": "http://localhost:3000",
	"token": "58394058227427124345"
}`;

export function LoginPage({setConfig}) {
	const [ cfgData, setCfgData ]= useState(SAMPLE_CONFIG);

	return (<>
		<h3>Paste the token you received</h3>
		<InputTextarea 
			value={cfgData} onChange={ (e) => setCfgData(e.target.value) }
			style={{width: '95vw', height: '50vh'}}	
		/> <br />
		<Button label="LogIn" onClick={() => setConfig(cfgData)} />
	</>)
}
