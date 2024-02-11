
import React, {useState, useEffect} from 'react'; 
import { Button } from 'primereact/button';

export function ViewLive({url, onGoBack}) {
	return (
		url 
			? (<>
					<div className="flex flex-columns h-3rem align-items-center">
						<div className="flex-1">Viewing <a href={url} target="_blank">live site</a></div>
						<div className="flex-0"><Button label="go back" size="small" onClick={onGoBack} /></div>
					</div>
					<iframe src={url} scrolling="auto" style={{ width: '100vw', height: '92vh'}}></iframe>
				</>)
			: <div>No url for live site</div>
	)
}

