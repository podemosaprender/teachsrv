//S: server
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import * as api from './api.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/src/:env/*', (req,res) => {
	const spec= api.pathsFromReq(req);
	const r= {path: spec.file_path} 
	if (spec.is_dir) {
		fs.readdir( spec.safe_path, {}, (err, files) => { res.json({ ...r, files}); })
	} else {
		fs.readFile( spec.safe_path, "utf8", (err, src) => { res.json({ ...r, src}); })
	}
})

app.post('/src/:env/*', async (req, res) => {
	const spec= api.pathsFromReq(req);
	const r= {path: spec.file_path} 
	const src= req.body.src;

	if (spec.is_dir) { res.json({ ...r, error: "Only files can be updated"}) }
	else if (src==null) { res.json({ ...r, error: "Source is null"}) }
	else { 
		const view_url= await api.env_ensure_is_running(spec.env_name);
		fs.writeFile(spec.safe_path, src, 'utf8', (err, ok) => {
			if (err) { res.json({ ...r, error: `Can't write ${err}`}); }
			else { res.json({ ...r, ok: 'saved', view_url: view_url }) }
		});
	}

});
const server = app.listen(3000,'0.0.0.0'); //XXX:sec, all?
