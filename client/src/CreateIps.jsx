import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function CreateIps () {
    const [ipAddress, setIpAddress] = useState()
    const [name, setName] = useState()
    const navigate = useNavigate()
  
    const Submit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/ping", {ipAddress,name})
        .then(result => {
            console.log(result)
            navigate('/')
        })
        .catch(err =>console.log(err))
    }
    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
           <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={Submit}>
                    <h2>Add New IP Address</h2>
                    <div className='mb-2'>
                    <label htmlFor="">IP Address</label>
                    <input type="text" placeholder='Enter IP address eg. 8.8.8..' className='form-control'
                    onChange={(e) => setIpAddress(e.target.value)}/>
                    </div>

                    <div className='mb-2'>
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder='Enter Name' className='form-control'
                    onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <button className="btn btn-success">Submit</button>
                </form>
           </div>
        </div>
    )
}

export default CreateIps;