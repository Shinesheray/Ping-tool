const express = require('express');
const cors = require('cors');
const ping = require('ping');
//const mongoose = require('mongoose');
const IPAddress = require('./models/IP');

// Now you can use IPAddress to perform operations like find, create, update, and delete IP addresses.

const router = express.Router();

// Enable CORS for development purposes
router.use(cors());

// Parse JSON requests
router.use(express.json());

// POST route to add a new IP address
router.post('/ping', async (req, res) => {
    const { ipAddress, name } = req.body;
  
    try {
      // Ping the ipAddress to check if it's reachable
      const response = await ping.promise.probe(ipAddress, { timeout: 2000 });
  
      // Create a new IP address document with timestamp
      const newIPAddress = new IPAddress({
        ipAddress,
        name,
        status: response.alive,
        timestamp: new Date() // Current date and time
      });
  
      // Save the IP address document to the database
      await newIPAddress.save();
  
      res.status(201).json({ message: 'IP address added successfully', data: newIPAddress });
    } catch (error) {
      console.error('Error adding IP address:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// POST route to ping an existing IP address and update its status
router.post('/ping/ping-only', async (req, res) => {
  const { ipAddress } = req.body;

  try {
    // Ping the ipAddress to check if it's reachable
    const response = await ping.promise.probe(ipAddress, { timeout: 2000 });

    // Find the IP address in the database
    const ip = await IPAddress.findOne({ ipAddress });

    if (!ip) {
      return res.status(404).json({ status: 'error', message: 'IP address not found' });
    }

    // Update the status of the IP address based on the ping result
    ip.status = response.alive;
    await ip.save();

    return res.status(200).json({ status: 'success', message: 'Ping successful', data: ip });
  } catch (error) {
    console.error('Error performing ping:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


// GET route to retrieve all IP addresses
router.get('/ping', async (req, res) => {
  IPAddress.find({}).sort({ timestamp: -1 })
  .then(ipAddresses => res.json(ipAddresses))
  .catch(err => res.json(err))
  });

  //GET Route for updating a specific record
  router.get('/ping/getIP/:id', async (req, res) => {
    const id = req.params.id;
    IPAddress.findById({_id:id})
    .then(ipAddresses => res.json(ipAddresses))
    .catch(err => res.json(err))
    });

 // Route for pinging all existing records
router.get('/ping/ping-all', async (req, res) => {
  try {
    // Retrieve all IP addresses from the database
    const ipAddresses = await IPAddress.find();

    // Ping each IP address sequentially
    const pingResults = await Promise.all(ipAddresses.map(async (ip) => {
      try {
        const response = await ping.promise.probe(ip.ipAddress, { timeout: 2000 });
        // Update the status of the IP address in the database
        ip.status = response.alive;
        await ip.save();
        return { ipAddress: ip.ipAddress, status: response.alive ? 'success' : 'failure' };
      } catch (error) {
        console.error('Error performing ping:', error);
        return { ipAddress: ip.ipAddress, status: 'error' };
      }
    }));

    return res.status(200).json({ status: 'success', data: pingResults });
  } catch (error) {
    console.error('Error pinging all IP addresses:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
  
// DELETE route to delete an IP address by ID
router.delete('/ping/delete/:id', (req, res) => {
  const id = req.params.id;
  IPAddress.findByIdAndDelete({_id: id})
  .then(res => res.json({ message: 'IP address deleted successfully' }))
  .catch(err => res.json(err))
});

// PUT route to update an IP address by ID
router.put('/ping/update/:id', (req, res) => {
  const id  = req.params.id;
  IPAddress.findByIdAndUpdate({_id: id}, {
    ipAddress: req.body.ipAddress,
     name: req.body.name
    })
  .then(ipAddresses => res.json(ipAddresses))
  .catch(err => res.json(err))
});

module.exports = router;
