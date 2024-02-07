/* eslint-disable react-hooks/exhaustive-deps */
          
import React, { useEffect, useState } from 'react'; 

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Button } from 'primereact/button';
import { host_code } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPath } from '../state/reactPath/pathSlice';
import { Dropdown } from 'primereact/dropdown';
import { setCode } from '../state/code/codeSlice';
import { okaidia } from '@uiw/codemirror-themes-all';
export const envName = 'pepe';

// eslint-disable-next-line react/prop-types
export default function ViewCode() {
	const path =useSelector(state => state.path.value); 
	const code = useSelector(state => state.code.value);
	
	const onGuardar = async () => {
		await fetch(`${host_code}/src/${envName}/${path}`, { 
			method: "POST", headers: {"Content-type": "application/json"}, 
			body: JSON.stringify({src: code})
		});

	}


    const onChange = React.useCallback((val, viewUpdate) => {
        console.log('val:', val);
      }, []);
    return (
<>
			<CodeOptions className="my-8"/>
                <CodeMirror
                    value={code}	
                    onChange={onChange} 
					height="85vh" 
					theme={okaidia}
					extensions={[javascript({ jsx: true })]} 
					basicSetup={{
						highlightActiveLineGutter: true,
						bracketMatching: true,
						autocompletion: true,
						tabSize: 2,
					}}
				/>

			
</>
            
        )
}
             
function CodeOptions() {
	const [loading, setLoading] = useState(false);


    const load = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };
	const onLeer= async () => {
		const r= await fetch(`${host_code}/src/${envName}/${path}`).then(res => res.json());
		if(r.src) dispatch(setCode(r.src));
	}
	useEffect(() => {
	onLeer();
	},[])
	
    const path =useSelector(state => state.path.value);
    const dispatch = useDispatch();
	const _items = [{path:"App.jsx"},{path:"component/header.jsx"},{path:"component/menu.jsx"},{path:"component/home.jsx"}];

    return (
		<>
		<div className="card flex justify-between py-2">
			<div>
			<Dropdown value={path} onChange={(e) =>dispatch(setPath(e.value.path))} 
			options={_items} 
			optionLabel="path" 
			editable placeholder="Select Archivo" className="w-full md:w-16rem" />
			</div>
	
				<div className="card">
					<Button label="save" icon="pi pi-save" loading={loading} onClick={load} />
				</div>
		</div>
   
		</>
			
     )
}
        