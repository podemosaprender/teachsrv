//FROM: https://github.com/uiwjs/react-codemirror?tab=readme-ov-file#usage

/* NEXT STEP
 await fetch('http://localhost:3000/src/pepe/calefon.jsx',{method: 'post', headers: {'Content-type': 'application/json'}, body: '{"x": 10, "src":"hola"}'}).then(x=> x.json())
*/

import React from 'react';
import { useState } from 'react';
import MenuTab from './components/tabMenu';
import {  BrowserRouter, Outlet, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import ViewCode from './pages/ViewCode';
import ViewPage from './pages/ViewPage';
import Home from './pages/Home';
import Layout from './pages/Layout';



export const host_base=`http://${location.host.replace(/:\d+/,'')}`
export const host_code=`${host_base}:3000`
export const host_vista=`${host_base}:5173` //XXX:conseguir de host_code
const router = createBrowserRouter([
	{ // eslint-disable-next-line no-mixed-spaces-and-tabs
	  path: "/", element: <Layout/>,
      children: [
		{ path: '' ,element: <Home />},
		{ path: "/view-code", element: <ViewCode/>},
		{ path: "/view-page", element: <ViewPage/>}
]
	},
  ] ,);
export function App() {

	const [envName, setEnvName]= useState('pepe'); //XXX:HC
  const [archivo, setArchivo] = useState("App.jsx");




	const onLeer= async () => {
		const r= await fetch(`${host_code}/src/${envName}/${archivo}`).then(res => res.json());
		setCode(r.src);
		setEstadoGuardar('guardado');
	}

	// <Button label="Leer" onClick={onLeer} />
	// <Button label="Guardar" onClick={onGuardar} />
	// <Button label="Ver" onClick={() => setVista('resultado')} />
	// <Button label="Codigo" onClick={() => setVista('codigo')} />


	return (
<RouterProvider router={router} > </RouterProvider>


);
}
