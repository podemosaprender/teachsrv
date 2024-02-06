import React, { useState } from 'react'; 
import { AutoComplete } from "primereact/autocomplete";
import { useDispatch, useSelector } from 'react-redux';
import { setPath } from '../state/reactPath/pathSlice';
const Home=()=> {return (
    
    <><h1> Podemos Aprender </h1>
    <h2> Bienvenido Alejandro</h2>
    <h2> Seleccione donde va a trabajar</h2>

    <DropdownDemo  />
    
    </>
    )};


export default Home;


  function DropdownDemo() {
    const [value, setValue] = useState('App.jsx');
    const [items, setItems] = useState([]);

    const path = useSelector(state => state.path.value)
    const dispatch = useDispatch()

    const search = (event) => {
        let _items = ["App.jsx","component/header.jsx","component/menu.jsx","component/home.jsx"];
        setItems(_items.filter(e => e.toLowerCase().includes(event.query.toLowerCase())));
    }

    return (
        <div className="card flex justify-content-center">
            <AutoComplete value={path} suggestions={items} completeMethod={search} onChange={(e) => {
                    dispatch(setPath(e.value) )
                setValue(e.value)}} dropdown />
        </div>
    )
}
        