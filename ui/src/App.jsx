//FROM: https://github.com/uiwjs/react-codemirror?tab=readme-ov-file#usage

/* NEXT STEP
 await fetch('http://localhost:3000/src/pepe/calefon.jsx',{method: 'post', headers: {'Content-type': 'application/json'}, body: '{"x": 10, "src":"hola"}'}).then(x=> x.json())
*/

import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

import { setConfig as apiSetConfig, file_list, file_read, file_write } from './services/codeapi';

import { TabMenu } from './components/tabmenu';
import ViewCode from './pages/ViewCode';
import ViewPage from './pages/ViewPage';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';


export function App() {

	const toast = useRef(null);
	const msgShow= (msg, msg_type, msg_title) => { //U: ALL messages must be shown using this function
		if (typeof(msg)=='string') { msg= { detail: msg, severity: msg_type, summary: msg_title } }
		msg= Object.assign({}, { severity: 'info', summary: 'info', detail: '', life: 3000 }, msg)
		toast.current.show([ msg ]);
	}
	//A: have a function to show feedback messages

	const [config, setConfig]= useState(); //XXX:CFG
	const onSetConfig= async (tokenText) => { try {
			await apiSetConfig(tokenText); //A: throws if not valid
			setConfig(tokenText);
		} catch (ex) { msgShow(ex+'','error','Invalid token'); }
	}

	const [envName, setEnvName]= useState(''); //U: ''=default from config, teachers may use more than one if allowed

	const [allPaths, setAllPaths]= useState([]); //U: path -> R|W, all files a user can read or edit in this env
	const [codeForPath, setCodeForPath]= useState({}); //U: path -> string, the read or edited code for this path
	const [activeIndex, setActiveIndex]= useState(0); //U: 0==home,1==files, (index+2) in codeForPaths keys 

	const paths= Object.keys(codeForPath);
	const activePath= paths[activeIndex-2]; //U: path currently being edited
	if (activePath!=null) { window.location.hash= activePath };

	const updateOurCopyOfCodeForPath= (kv,path) => { //U: update our local copy of code for path
		path= path || activePath;
		const kv_updated= {...codeForPath[path], ...kv};
		kv_updated.isLoaded= (kv_updated.src != null);
		//DBG: console.log("updatedCodeForPath",path,kv,kv_updated);
		setCodeForPath({...codeForPath, [path]: kv_updated})
	};

	const onPathSelectedToWork= (filePath) => updateOurCopyOfCodeForPath({isLoaded: false, path: filePath}, filePath); //U: a path is selected for editing but not read yet, see useEffect below

	const ensurePathDataForView= async (thePath) => {
		if (config!=null) {
			if (thePath=="*file_list*") {  try { //A: reloads every time you go to home, XXX:limit? refresh button?
					msgShow('loading file list');
					const l= await file_list(envName)
					setAllPaths(l) 
				} catch (ex) { msgShow(ex+'','error',"Can't load file list"); }
			} else if (thePath && !codeForPath[thePath]?.isLoaded) { try {
					msgShow(thePath, null, 'loading file');
					const r= await file_read(envName,activePath)
					updateOurCopyOfCodeForPath(r, thePath);
				} catch (ex) { msgShow(ex+'','error',"Can't load "+thePath); }
			}
		}
	}

	useEffect( () => {
		ensurePathDataForView( activeIndex==0 ? '*file_list*' : activePath );
	}, [config, activeIndex, codeForPath]);
	//A: we ensure the current ViewCode or FileSelector have the required file data

	const onUploadActivePath= async () => {
		msgShow(activePath, 'info', 'Uploading');	
		try {
			await file_write(envName, activePath, codeForPath[activePath].src)
			msgShow(activePath, 'success', 'Uploaded');	
		} catch (ex) {
			msgShow(activePath, 'error', 'Not uploaded');	
		}
	};

	//S: props for components we call
	const tabMenuItems = [
		{ label: 'upload this file', icon: 'pi pi-upload', command: onUploadActivePath }, 
		{ label: 'git add', icon: 'pi pi-cloud-upload', command: onUploadActivePath }, 
		{ label: 'view result', icon: 'pi pi-eye', command: () => setActiveIndex(1) }, 
		{ label: 'home', icon: 'pi pi-home', command: () => setActiveIndex(0) },
	];
	const tabMenuProps= { items: tabMenuItems }
	const homeProps= { onPathSelectedToWork, allPaths, codeForPath, setActiveIndex }
	const viewCodeProps= {
		code: codeForPath[activePath]?.src, 
		setCode: (src) => updateOurCopyOfCodeForPath({src, path: activePath, edited_ts: new Date()}, activePath),
	};
	
	//DBG: console.log("codeForPath", activePath, codeForPath, allPaths);
	//S: render our screen
	return (<>
		<Toast ref={toast} />
		{ config == null ? (<LoginPage setConfig={onSetConfig} />) 
			: (<>
					{ activeIndex!= 0 ? <TabMenu {...tabMenuProps} /> : '' }
					{ 
						activeIndex==0 ? <Home {...homeProps} /> :
						activeIndex==1 ? <ViewPage /> :
						<ViewCode {...viewCodeProps}/>
					}
			  </>)
		}
	</>)
}
