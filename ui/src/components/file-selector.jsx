import { useState } from 'react';
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";

export function FileSelector({onAddPath}) {
	const [value, setValue] = useState('App.jsx');
	const [items, setItems] = useState([]);

	const search = (event) => {
		let _items = ["App.jsx","components/micalendar.jsx","components/miform.jsx"]; //XXX:FETCH
		setItems(_items.filter(e => e.toLowerCase().includes(event.query.toLowerCase())));
	}

	return (
		<div className="card flex justify-content-center">
			<AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e) => {
				//dispatch( viewPathAdd(e.value) )
				setValue(e.value)}} dropdown 
			/>
			<Button aria-label="Open" icon="pi pi-plus" onClick={() => onAddPath(value)} />
		</div>
	)
}

