import { Outlet } from "react-router-dom";
import { TabMenu } from "../components/tabmenu";

export const Layout =()=>{
	return (<>
		<TabMenu/>
		<Outlet/>
	</>)
}


