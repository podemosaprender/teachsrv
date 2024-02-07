import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AutoComplete } from "primereact/autocomplete";

import { viewPathAdd } from '../state/viewpaths/pathSlice';

export function FileSelector() {
//XXX const paths = useSelector(state => state.paths.value)
	const [value, setValue] = useState('App.jsx');
	const [items, setItems] = useState([]);

	const dispatch = useDispatch()

	const search = (event) => {
		let _items = ["App.jsx","component/header.jsx","component/menu.jsx","component/home.jsx"]; //XXX:FETCH
		setItems(_items.filter(e => e.toLowerCase().includes(event.query.toLowerCase())));
	}

	return (
		<div className="card flex justify-content-center">
			<AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e) => {
				dispatch( viewPathAdd(e.value) )
				setValue(e.value)}} dropdown 
			/>
		</div>
	)
}

