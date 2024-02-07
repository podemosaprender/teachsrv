import React, { useState } from 'react'; 
import { FileSelector } from '../components/file-selector';

export const Home= ({onAddPath, allPaths})=> {
	return ( <>
		<h1> Podemos Aprender </h1>
		<h2> Bienvenido Alejandro</h2>
		<h2> Seleccione donde va a trabajar</h2>
		<FileSelector onAddPath={onAddPath} allPaths={allPaths} />
	</>
	)
};
