import React, { useState } from 'react'; 
import { FileSelector } from '../components/file-selector';

export const Home= (props)=> {
	return ( <>
		<FileSelector {...props} />
	</>
	)
};
