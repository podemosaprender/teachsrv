import { Outlet } from "react-router-dom";
import MenuTab from "../components/tabMenu";

const Layout =()=>{
    return (<>
            <MenuTab></MenuTab>
            
            <Outlet/>

    </>
    
    )
}

export default Layout;