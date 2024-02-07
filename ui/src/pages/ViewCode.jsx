import React, { useMemo, useState } from 'react'; 

import { useLocation } from 'react-router-dom';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Button } from 'primereact/button';

import { file_read, file_write } from '../services/codeapi';

// eslint-disable-next-line react/prop-types
export default function ViewCode({codeInitial}) {

	const location = useLocation();
	//DBG: console.log("ViewCode", location.pathname);

	const [code, setCode] = useState(codeInitial); //XXX:HC
	const [estadoGuardar, setEstadoGuardar] = useState('');

	const onGuardar= async () => {
		setEstadoGuardar('pendiente');
		//XXX:file_write with params, from Redux?
		setEstadoGuardar('guardado');
	}

	const onChange = React.useCallback((val, viewUpdate) => {
		console.log('val:', val);
		setCode(val);
	}, []);

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

