import { useState } from "react";
import MenuTab from "../components/tabMenu";
import Home from "./Home";
import ViewCode from "./ViewCode";
import ViewPage from "./ViewPage";


const bodySelect = {
    0: <Home />,
    1: <ViewCode />,
    2: <ViewPage />
}

const Layout =()=>{

    const [activeIndex, setActiveIndex] = useState(0);
    const handleTabChange = (index) => {
        setActiveIndex(index);
    }

    return (<>
            <MenuTab  onTabChange={handleTabChange}/>
            { bodySelect[activeIndex] }
    </>
    
    )
}

export default Layout;