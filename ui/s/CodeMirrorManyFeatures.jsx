//INFO: main App entry point

import { useState } from 'react'
import './App.css'

import CodeMirror from '@uiw/react-codemirror';
import * as alls from '@uiw/codemirror-themes-all';
import { color } from '@uiw/codemirror-extensions-color';
import { langs } from '@uiw/codemirror-extensions-langs';

const code=`const x= {props} => (<div>{props}</div>)`
//console.log("langs", langs)


export function App() {
	const editable= true;
	const extensions= [color, langs['jsx']];
	const basicSetup= {crosshairCursor: false};
	const themeOptions = ['dark', 'light']
		.concat(Object.keys(alls))
		.filter((item) => alls[item] !== 'function')
		.filter((item) => !/^(defaultSettings)/.test(item));
	const theme= 'dark';

	return (
		<CodeMirror
			value={code}
			height={`200px !important`}
			// @ts-ignore
			theme={alls[theme] || theme}
			editable={editable}
			extensions={extensions}
			autoFocus={true}
			basicSetup={basicSetup}
			placeholder={"Tu codigo"}
			onChange={(val) => {
				// https://github.com/uiwjs/react-codemirror/issues/449
				// setCode(val)
			}}
			style={{
				maxWidth: '995px',
				position: 'relative',
				zIndex: 999,
			}}
		/>
	)
}


