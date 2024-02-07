import React, { useState, useEffect, useCallback } from 'react'; 

import { SpeedDial } from 'primereact/speeddial';

export function TabMenu({items}) {
	const computeDirection= () => ( //XXX:LIB
		( window.visualViewport.width >	window.visualViewport.height ) ? "left" : "down"
	);

	const [direction, setDirection]= useState( computeDirection() );
	const updateDirection= useCallback(
		() => setDirection( computeDirection() ),
		[setDirection]
	)
	
	useEffect(() => {
		window.addEventListener('resize', updateDirection);
		return () => window.removeEventListener('resize', updateDirection);
	},[updateDirection]);

	return (<SpeedDial
		model={items} onClick={(e) => console.log(e)}
		type="linear" direction={direction} style={{ position: 'fixed', right: '10px', top: '10px' }} 
		buttonStyle={{height: '45px', width: '45px'}}
		showIcon="pi pi-wrench"
	/>)
}

