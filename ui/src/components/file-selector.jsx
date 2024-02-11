import { useState } from 'react';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { SelectButton } from 'primereact/selectbutton';

export function FileSelector({onAddPath, allPaths, codeForPath, setActiveIndex}) {
	const editedPaths= Object.keys(codeForPath)
	const isEditingSome= editedPaths.length>0;
	const [statusFilter, setStatusFilter] = useState(isEditingSome ? 'Editing' : 'All');

	const options= (statusFilter=='All' ? Object.keys(allPaths) : editedPaths).map(p => ({
		path: p,
		isBeingEdited: codeForPath[p]!=null,
		isChanged: ( codeForPath[p]?.edited_ts > (codeForPath[p]?.loaded_ts||0) )
	}));

	const itemTemplate= (option) => {
		return (<div className="flex flex-row align-items-center">
			<div className="flex-1">{option.path}</div>
			<div className="flex-0">
				{option.isBeingEdited ? <Button label="XXX git add" /> : ''}
				<Button 
				aria-label={option.isBeingEdited ? 'E' : 'P'} 
				icon={option.isBeingEdited ? 'pi pi-file-edit' : 'pi pi-download'} 
				onClick={() => {
					const idx= editedPaths.indexOf(option.path);
					if (idx>-1) { setActiveIndex(2+idx) }
				}}
			/></div>
		</div>)
	}

	return (<>
		<div className="card flex flex-column">
			<div className="flex-0 text-right mb-1">
				<div>
					<Button label="XXX open result in another tab" />
					<Button label="XXX git commit" />
					<Button label="XXX upload all" />
					<Button label="XXX new file" />
				</div>
				<SelectButton value={statusFilter} onChange={(e) => setStatusFilter(e.value)} options={["Editing","All"]} />
			</div>
			<div className="flex-1">
				<ListBox filter 
					value={editedPaths} onChange={(e) => onAddPath(e.value.path)} 
					options={options} optionLabel="path"
					itemTemplate={itemTemplate}
					className="w-full" 
					listStyle={{maxHeight: '50vh'}}
				/>
			</div>
		</div>
	</>)
}

