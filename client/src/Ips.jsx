import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";



function AllIps () {
    const [ipAddresses, setIps] = useState([])

    useEffect(()=> {
        axios.get('http://localhost:3001/ping')
        .then(result => setIps(result.data))
        .catch(err => console.log(err))
    },[])

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/ping/delete/'+id)
        .then(res => {
            console.log(res)
            window.location.reload()
        })
        .catch(err => console.log(err))
    }

    const handlePing = async () => {
        try {
            const response = await axios.get('http://localhost:3001/ping/ping-all');
            console.log(response.data); // Handle response accordingly
           window.location.reload();
          } catch (error) {
            console.error('Error pinging all IP addresses:', error);
          }
      }
      const handleSinglePing = async (ipAddress) => {
        try {
          const response = await axios.post('http://localhost:3001/ping/ping-only', { ipAddress });
          console.log(response.data); // Handle response accordingly
          window.location.reload();
        } catch (error) {
          console.error('Error pinging IP address:', error);
        }
      }
    

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className='w-70 bg-white rounded p-3'>
<Link to="/create" className="btn btn-success">Add New IP +</Link> 
<button className="btn btn-danger" onClick={handlePing}>Ping All</button>               
<table className="table">
    <thead>
        <tr>
            <th>IP Adress</th>
            <th>Name</th>
            <th>Status</th>
            <th>Last Ping time</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {
            ipAddresses.map((ipAddresse) => {
                const lastPingTime = new Date(ipAddresse.timestamp).getTime();
                const elapsedTime = Date.now() - lastPingTime;
           return     <tr key={ipAddresse._id}>
                    <td>{ipAddresse.ipAddress}</td>
                    <td>{ipAddresse.name}</td>
                    <td>
                    <span
                        className={`badge ${
                          ipAddresse.status
                            ? "bg-success"
                            : elapsedTime > 50
                            ? "bg-danger"
                            : elapsedTime > 500
                            ? "bg-warning"
                            : ""
                        }`}
                      >
                        {ipAddresse.status
                          ? "Alive"
                          : elapsedTime > 50
                          ? "Dead"
                          : elapsedTime > 500
                          ? "Slow"
                          : ""}
                      </span>
                    </td>
                    <td>{ipAddresse.timestamp}</td>
                    <td>
                    <Link to={`/update/${ipAddresse._id}`} className="btn btn-success btn-sm">Update</Link>
                    <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(ipAddresse._id)}>Delete</button>
                    <button className="btn btn-success btn-sm" 
                    onClick={() => handleSinglePing(ipAddresse.ipAddress)} >Ping</button>
                    </td>
                      
                </tr>
            })
        }
    </tbody>
</table>
            </div>
        </div>
    )
}

export default AllIps;