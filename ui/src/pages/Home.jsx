import React, { useState } from 'react'; 
import { FileSelector } from '../components/file-selector';

export const Home= (props)=> {
	return ( <div className="card" style={{maxWidth: '80rem', margin: 'auto'}}>
		<FileSelector {...props} />
	</div>
	)
};
