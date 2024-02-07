import React, {  useState } from 'react'; 

import { TabMenu as PrimeTabMenu } from 'primereact/tabmenu';

export function TabMenu({activeIndex, setActiveIndex, paths}) {
	const items = [
		{ label: '', icon: 'pi pi-home', data: '/' },
		{ label: '', icon: 'pi pi-play', data: '/result'}, 
		...((paths||[]).map( p => ({ label: p, icon: 'pi pi-file', data: `/code/${p}` }))),
	];

	const onTabChange= (e) => {
		setActiveIndex(e.index);
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

