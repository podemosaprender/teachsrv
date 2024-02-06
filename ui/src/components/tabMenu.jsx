
import React, {  useState } from 'react'; 
import { TabMenu } from 'primereact/tabmenu';
import { useSelector } from 'react-redux';

export default function MenuTab() {

    const [activeIndex, setActiveIndex] = useState(3);
    const path = useSelector(state => state.path.value)

    const items = [
        { label: 'Home', icon: 'pi pi-home', url: '/' },

        { label: 'src: '+path, icon: 'pi pi-file', url: '/view-code' },

        { label: 'Vista', icon: 'pi pi-play', url: '/view-page'}, //pi-microsoft //globe pi-play
    ];

    return (
       
       <>
       
       <div className="card">
       <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />

        </div>

    
        </>
       )
}
        