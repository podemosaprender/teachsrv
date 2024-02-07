import React, { useState } from 'react';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

export function LoginPage({setConfig}) {
	const [ cfgData, setCfgData ]= useState('');

	return (<>
		<h1>Paste the token you received</h1>
		<InputTextarea 
			value={cfgData} onChange={ (e) => setCfgData(e.target.value) }
			rows={5} cols={40}
		/> <br />
		<Button label="LogIn" onClick={() => setConfig(cfgData)} />
	</>)
}
