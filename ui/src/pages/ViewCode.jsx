import React, { useState, useCallback } from 'react'; 

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ViewCode({code, setCode}) {
	const onChange = useCallback((val, viewUpdate) => {
		setCode(val);
	}, [setCode]);

	return (<>
			<CodeMirror
				value={code}	
				onChange={onChange} 
				height="95vh" 
				extensions={[javascript({ jsx: true })]} 
				theme="dark"
				basicSetup={{
					highlightActiveLineGutter: true,
					bracketMatching: true,
					autocompletion: true,
					tabSize: 2,
				}}
			/>
		</>)
}

