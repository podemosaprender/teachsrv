//FROM: https://github.com/uiwjs/react-codemirror?tab=readme-ov-file#usage

/* NEXT STEP
 await fetch('http://localhost:3000/src/pepe/calefon.jsx',{method: 'post', headers: {'Content-type': 'application/json'}, body: '{"x": 10, "src":"hola"}'}).then(x=> x.json())
*/

import React from 'react';

import { Button } from 'primereact/button';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export function App() {
  const [value, setValue] = React.useState("console.log('hello world!');");

  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

	const onGuardar= () => {
		fetch('http://localhost:3000/', { method: "POST", headers: {"Content-type": "application/json"}, body: JSON.stringify({code: value})})
	}

	return (<>
		<div>
			<Button label="Guardar" onClick={onGuardar} />
		</div>
		<CodeMirror 
			value={value}	onChange={onChange} 
			height="200px" 
			extensions={[javascript({ jsx: true })]} 
			basicSetup={{
				highlightActiveLineGutter: true,
				bracketMatching: true,
				autocompletion: true,
				tabSize: 2,
			}}
		/>
	</>);
}
