import { useState } from 'react';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { SelectButton } from 'primereact/selectbutton';

export function FileSelector({onPathSelectedToWork, allPaths, codeForPath, setActiveIndex}) {
	const editedPaths= Object.keys(codeForPath)
	const isEditingSome= editedPaths.length>0;
	const [statusFilter, setStatusFilter] = useState(isEditingSome ? 'Editing' : 'All');

	const options= (statusFilter=='All' ? Object.keys(allPaths) : editedPaths).map(p => ({
		path: p,
		isBeingEdited: codeForPath[p]!=null,
		isChanged: ( codeForPath[p]?.edited_ts > (codeForPath[p]?.loaded_ts||0) )
	}));

	const itemTemplate= (option) => { //U: render each item in the list
		const msg= option.isBeingEdited ? `Edit ${option.path}` : `Start editing ${option.path}`;
		return (<div className="flex flex-row align-items-center">
			<div className="flex-1">{option.path}</div>
			<div className="flex-0">
				{option.isBeingEdited ? <Button label="XXX git add" /> : ''}
				<Button 
				aria-label={msg}
				icon={option.isBeingEdited ? 'pi pi-file-edit' : 'pi pi-download'} 
				tooltip={msg}
				onClick={() => {
					const idx= editedPaths.indexOf(option.path);
					if (idx>-1) { setActiveIndex(2+idx) }
				}}
			/></div>
		</div>)
	}

	return (<>
		<div className="card">
			<div>
				<Button label="XXX: get from server git commit" />
			</div>
			<div className="flex flex-columns mb-1">
				<div className="flex flex-1 flex-wrap gap-1 text-left">
					<Button aria-label="Upload All" tooltip="Upload all edited files" icon="pi pi-upload" />
					<Button aria-label="Edit New File" tooltip="Edit New file" icon="pi pi-file-edit"/>
					<Button aria-label="View EditedApp" tooltip="View EditedApp" icon="pi pi-eye" onClick={() => setActiveIndex(1)}/>
				</div>
				<div className="flex flex-0 text-right" >
					<SelectButton value={statusFilter} onChange={(e) => setStatusFilter(e.value)} options={["Editing","All"]} />
				</div>
			</div>
			<div className="flex-1">
				<ListBox filter 
					value={editedPaths} onChange={(e) => onPathSelectedToWork(e.value.path)} 
					options={options} optionLabel="path"
					itemTemplate={itemTemplate}
					className="w-full" 
					listStyle={{maxHeight: '50vh'}}
				/>
			</div>
		</div>
	</>)
}

