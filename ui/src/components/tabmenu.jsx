import React, {  useState } from 'react'; 
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { TabMenu as PrimeTabMenu } from 'primereact/tabmenu';

import { viewPathsSelector } from '../state/viewpaths/pathSlice';

export function TabMenu() {
	const navigate = useNavigate();

	const [activeIndex, setActiveIndex] = useState(3);
	const paths = useSelector(viewPathsSelector)

	const items = [
		{ label: 'Home', icon: 'pi pi-home', data: '/' },
		...(paths.map( p => ({ label: p, icon: 'pi pi-file', data: `/code/${p}` }))),
		{ label: 'View', icon: 'pi pi-play', data: '/result'}, 
	];

	const onTabChange= (e) => {
		setActiveIndex(e.index);
		navigate(e.value.data);
	}

	return (<>
		<div className="card">
			<PrimeTabMenu
				model={items}
				activeIndex={activeIndex}
				onTabChange={onTabChange}
			/>
		</div>
	</>)
}

