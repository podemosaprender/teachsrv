
import React, {  useState } from 'react'; 
import { TabMenu } from 'primereact/tabmenu';

// eslint-disable-next-line react/prop-types
export default function MenuTab( {onTabChange}) {

    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Home', icon: 'pi pi-home' },

        { label: 'Codigo', icon: 'pi pi-file' },

        { label: 'Vista', icon: 'pi pi-play' }, //pi-microsoft //globe pi-play
    ];

    const handleTabChange = (e) => {
      setActiveIndex(e.index);
      if (onTabChange) {
        onTabChange(e.index);
      }
    };

    return (
       
       <>
       
       <div className="card">
       <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
      />

        </div>

    
        </>
       )
}
        