          
import React, { useMemo, useState } from 'react'; 

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Button } from 'primereact/button';
import { host_code } from '../App';

// eslint-disable-next-line react/prop-types
export default function ViewCode({codeInitial}) {

	const [code, setCode] = useState(codeInitial); //XXX:HC
	const [estadoGuardar, setEstadoGuardar] = useState('');

	const onGuardar= async () => {
		setEstadoGuardar('pendiente');
		await fetch(`${host_code}/src/${envName}/${archivo}`, { 
			method: "POST", headers: {"Content-type": "application/json"}, 
			body: JSON.stringify({src: code})
		});
		setEstadoGuardar('guardado');
	}

    const onChange = React.useCallback((val, viewUpdate) => {
        console.log('val:', val);
        setCode(val);
      }, []);

    return (
<>

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

</>
            
        )
}
             
