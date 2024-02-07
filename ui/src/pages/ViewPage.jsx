
import React from 'react'; 
import { host_vista } from '../services/codeapi';

export default function ViewPage() {
	return ( <>
		<iframe src={host_vista} style={{ width: '100vw', height: '85vh'}}></iframe>
	</>)
}

