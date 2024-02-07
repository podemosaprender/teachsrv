import React, { useState, useCallback } from 'react'; 

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Button } from 'primereact/button';

export default function ViewCode({code, setCode}) {
	const [estadoGuardar, setEstadoGuardar] = useState('');

	const onGuardar= async () => {
		setEstadoGuardar('pendiente');
		//XXX:file_write with params, from Redux?
		setEstadoGuardar('guardado');
	}

	const onChange = useCallback((val, viewUpdate) => {
		setCode(val);
	}, [setCode]);

	return (<>
			<CodeMirror
				value={code}	
				onChange={onChange} 
				height="85vh" 
				extensions={[javascript({ jsx: true })]} 
				basicSetup={{
					highlightActiveLineGutter: true,
					bracketMatching: true,
					autocompletion: true,
					tabSize: 2,
				}}
			/>

			<Button label='save' icon='pi pi-save' style={{    position: 'fixed',bottom: '20px',right: '20px',}}/> 

		</>)
}

