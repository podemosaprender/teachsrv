//FROM: https://github.com/uiwjs/react-codemirror?tab=readme-ov-file#usage

/* NEXT STEP
 await fetch('http://localhost:3000/src/pepe/calefon.jsx',{method: 'post', headers: {'Content-type': 'application/json'}, body: '{"x": 10, "src":"hola"}'}).then(x=> x.json())
*/

import React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { file_read, file_list } from './services/codeapi';

import { TabMenu } from './components/tabmenu';
import ViewCode from './pages/ViewCode';
import ViewPage from './pages/ViewPage';
import { Home } from './pages/Home';


export function App() {
	const [envName, setEnvName]= useState('pepe'); //XXX:CFG
	const [allPaths, setAllPaths]= useState([]);
	const [codeForPath, setCodeForPath]= useState({});
	const [activeIndex, setActiveIndex]= useState(0);

	const paths= Object.keys(codeForPath);
	const activePath= paths[activeIndex-2];
	if (activePath!=null) { window.location.hash= activePath };

	const updateCodeForPath= (kv,path) => {
		path= path || activePath;
		const kv_updated= {...codeForPath[path], ...kv};
		kv_updated.isLoaded= (kv_updated.src != null);
		console.log("updatedCodeForPath",path,kv,kv_updated);
		setCodeForPath({...codeForPath, [path]: kv_updated})
	};

	const onAddPath= (filePath) => updateCodeForPath({isLoaded: false, path: filePath}, filePath);

	useEffect( () => {
		if (activePath && !codeForPath[activePath]?.isLoaded) {
			file_read(envName,activePath).then(updateCodeForPath);
		} else if (activeIndex==0) {
			file_list(envName).then(r => setAllPaths(r)) //A: reloads every time you go to home, XXX:limit? refresh button?
		}
	}, [activeIndex, codeForPath]);

	const tabMenuProps= {activeIndex, setActiveIndex, paths: Object.keys(codeForPath) }
	const homeProps= { onAddPath, allPaths, codeForPath }
	const viewCodeProps= {code: codeForPath[activePath]?.src, setCode: (src) => updateCodeForPath({src, edited_ts: new Date()})};
	//DBG: console.log("codeForPath", activePath, codeForPath, allPaths);
	return (<>
		<TabMenu {...tabMenuProps} />
		{ activeIndex==0 ? <Home {...homeProps} /> :
				activeIndex==1 ? <ViewPage /> :
				<ViewCode {...viewCodeProps}/>
		}
	</>)
}
