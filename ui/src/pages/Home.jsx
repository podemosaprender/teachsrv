import React, { useState } from 'react'; 
import { FileSelector } from '../components/file-selector';

export const Home= ({onAddPath, allPaths, codeForPath})=> {
	return ( <>
		<FileSelector onAddPath={onAddPath} allPaths={allPaths} codeForPath={codeForPath} />
	</>
	)
};
