const mongoose = require('mongoose');

// Define the IP schema
const IPSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true
  },
  name: String,
  status: Boolean, // true for alive, false for dead
  timestamp: { type: Date, default: Date.now },
  //versionKey: false 
});

// Create the IP model using the defined schema
const IPAddress = mongoose.model('IPAddress', IPSchema);

module.exports = IPAddress;
