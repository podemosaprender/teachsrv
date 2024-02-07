
import React from 'react'; 
import { host_base } from '../App';

export default function ViewPage() {
    const host_vista=`${host_base}:5173` //XXX:conseguir de host_code


    return (
    <>
        <iframe src={host_vista} style={{ width: '100vw', height: '85vh'}}></iframe>
    </>
    )
}
        