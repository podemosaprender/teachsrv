//FROM: https://github.com/uiwjs/react-codemirror?tab=readme-ov-file#usage

/* NEXT STEP
 await fetch('http://localhost:3000/src/pepe/calefon.jsx',{method: 'post', headers: {'Content-type': 'application/json'}, body: '{"x": 10, "src":"hola"}'}).then(x=> x.json())
*/
import Layout from './pages/Layout';

export const host_base=`http://${location.host.replace(/:\d+/,'')}`
export const host_code=`${host_base}:3000`

export function App() {


	// <Button label="Leer" onClick={onLeer} />
	// <Button label="Guardar" onClick={onGuardar} />
	// <Button label="Ver" onClick={() => setVista('resultado')} />
	// <Button label="Codigo" onClick={() => setVista('codigo')} />


	return (
			<Layout />
			
);
}
