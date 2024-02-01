//FROM: https://github.com/uiwjs/react-codemirror?tab=readme-ov-file#usage

/* NEXT STEP
 await fetch('http://localhost:3000/src/pepe/calefon.jsx',{method: 'post', headers: {'Content-type': 'application/json'}, body: '{"x": 10, "src":"hola"}'}).then(x=> x.json())
*/

import React from 'react';
import { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const host_base=`http://${location.host.replace(/:\d+/,'')}`
const host_code=`${host_base}:3000`
const host_vista=`${host_base}:5174` //XXX:conseguir de host_code

export function App() {
	const [vista, setVista]= useState('codigo');

	const [envName, setEnvName]= useState('pepe'); //XXX:HC
  const [archivo, setArchivo] = useState("App.jsx");
  const [estadoGuardar, setEstadoGuardar] = useState('');

	const [code, setCode] = useState("console.log('hello world!');"); //XXX:HC

	const onGuardar= async () => {
		setEstadoGuardar('pendiente');
		await fetch(`${host_code}/src/${envName}/${archivo}`, { 
			method: "POST", headers: {"Content-type": "application/json"}, 
			body: JSON.stringify({src: code})
		});
		setEstadoGuardar('guardado');
	}

	const onLeer= async () => {
		const r= await fetch(`${host_code}/src/${envName}/${archivo}`).then(res => res.json());
		setCode(r.src);
		setEstadoGuardar('guardado');
	}

  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setCode(val);
  }, []);

	return (<>
		<div>
			<InputText placeholder="Archivo" value={archivo} onChange={(e) => setArchivo(e.target.value)} />
		 {estadoGuardar}
			<Button label="Leer" onClick={onLeer} />
			<Button label="Guardar" onClick={onGuardar} />
			<Button label="Ver" onClick={() => setVista('resultado')} />
			<Button label="Codigo" onClick={() => setVista('codigo')} />
		</div>
		{ 
			vista=='codigo'
		 	? <CodeMirror 
					value={code}	onChange={onChange} 
					height="85vh" 
					extensions={[javascript({ jsx: true })]} 
					basicSetup={{
						highlightActiveLineGutter: true,
						bracketMatching: true,
						autocompletion: true,
						tabSize: 2,
					}}
				/>
			: <iframe src={host_vista} style={{ width: '100vw', height: '85vh'}}/>
		}
	</>);
}
