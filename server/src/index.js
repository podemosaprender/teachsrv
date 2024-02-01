CFG_EnvDir='../../../x'

//S: API

function pathsFromReq(req) {
	const env_name= req.params.env; //CHECK in envs, safe
	const file_path= req.params[0]; //CHECK safe
	const safe_path= `${CFG_EnvDir}/env_${env_name}/src/${file_path}`
	const is_dir= (file_path=='' || file_path.endsWith('/'))
	const r= {env_name, file_path, safe_path, is_dir}
	console.log("PATHS FROM REQ", req.method, r, req.params)
	return r;
}

//S: server
const fs= require('fs');
const express = require('express');
var cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/src/:env/*', (req,res) => {
	const spec= pathsFromReq(req);
	const r= {path: spec.file_path} 
	if (spec.is_dir) {
		fs.readdir( spec.safe_path, {}, (err, files) => { res.json({ ...r, files}); })
	} else {
		fs.readFile( spec.safe_path, "utf8", (err, src) => { res.json({ ...r, src}); })
	}
})

app.post('/src/:env/*', (req, res) => {
	const spec= pathsFromReq(req);
	const r= {path: spec.file_path} 
	const src= req.body.src;

	if (spec.is_dir) { res.json({ ...r, error: "Only files can be updated"}) }
	else if (src==null) { res.json({ ...r, error: "Source is null"}) }
	else { 
		fs.writeFile(spec.safe_path, src, 'utf8', (err, ok) => {
			if (err) { res.json({ ...r, error: `Can't write ${err}`}); }
			else { res.json({ ...r, ok: 'saved'}) }
		});
	}
});
const server = app.listen(3000);
