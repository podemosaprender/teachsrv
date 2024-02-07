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
	const [paths, setPaths]= useState(['App.jsx']);
	const [codeForPath, setCodeForPath]= useState({});
	const [activeIndex, setActiveIndex]= useState(0);

	const activePath= paths[activeIndex-2];
	if (activePath!=null) { window.location.hash= activePath };

	const setCodeForActivePath= (src) => {
			console.log("setCodeForActivePath",activePath,src);
			setCodeForPath({...codeForPath, [activePath]: src})
	}

	useEffect( () => {
		if (activePath && codeForPath[activePath]==null) {
			file_read(envName,activePath).then(setCodeForActivePath);
		} else if (activeIndex==0) {
			file_list(envName).then(r => setAllPaths(r))
		}
	}, [activeIndex, paths, setAllPaths]);

	const onAddPath= (filePath) => { paths.indexOf(filePath)<0 && setPaths([...paths, filePath]) }

	const tabMenuProps= {activeIndex, setActiveIndex, paths }
	const homeProps= { onAddPath, allPaths }
	const viewCodeProps= {code: codeForPath[activePath]?.src, setCode: (src) => setCodeForActivePath({...codeForPath[activePath], src})};
	//DBG: console.log("codeForPath", activePath, codeForPath, allPaths);
	return (<>
		<TabMenu {...tabMenuProps} />
		{ activeIndex==0 ? <Home {...homeProps} /> :
			activeIndex==1 ? <ViewPage /> :
			<ViewCode {...viewCodeProps}/>
		}
	</>)
}
