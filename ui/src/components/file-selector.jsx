import { useState } from 'react';
import { ListBox } from 'primereact/listbox';

export function FileSelector({onAddPath, allPaths}) {
	const [value, setValue] = useState('App.jsx');
	const [items, setItems] = useState([]);

	const search = (event) => {
		let _items = ["App.jsx","components/micalendar.jsx","components/miform.jsx"]; //XXX:FETCH
		setItems(_items.filter(e => e.toLowerCase().includes(event.query.toLowerCase())));
	}

	return (
		<div className="card flex justify-content-center">
      <ListBox filter 
				value={value} onChange={(e) => {setValue(e.value); onAddPath(e.value.path)}} 
				options={(allPaths||[]).map(p => ({path: p}))} optionLabel="path"
				className="w-full" 
				listStyle={{maxHeight: '50vh'}}
			/>
		</div>
	)
}

