//FROM: https://github.com/uiwjs/react-codemirror?tab=readme-ov-file#usage

/* NEXT STEP
 await fetch('http://localhost:3000/src/pepe/calefon.jsx',{method: 'post', headers: {'Content-type': 'application/json'}, body: '{"x": 10, "src":"hola"}'}).then(x=> x.json())
*/

import React from 'react';
import { useState } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { Layout } from './pages/Layout';
import { TabMenu } from './components/tabmenu';
import ViewCode from './pages/ViewCode';
import ViewPage from './pages/ViewPage';
import { Home } from './pages/Home';

const router = createHashRouter([
	{ // eslint-disable-next-line no-mixed-spaces-and-tabs
		path: "/", element: <Layout/>,
		children: [
			{ path: '' ,element: <Home />},
			{ path: "/code/*", element: <ViewCode/>},
			{ path: "/result", element: <ViewPage/>}
		]
	},
] ,);

export function App() {
	const [envName, setEnvName]= useState('pepe'); //XXX:CFG


	return (<RouterProvider router={router} />);
}
