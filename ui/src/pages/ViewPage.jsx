
import React, {useState, useEffect} from 'react'; 
import { url_vista } from '../services/codeapi';

export default function ViewPage() {
	const [url, setUrl]= useState('')
	useEffect(() => {
		url_vista('pepe').then( setUrl );
	}, []);

	return ( <>
		{ url ? <iframe src={url} style={{ width: '100vw', height: '85vh'}}></iframe> : 'loading' }
	</>)
}

