import mongoose from 'mongoose'

const rideSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  captain:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain',
    required: true
  },
  pickup: {
    type: String,
    required: true
  },
  destination:{
    type: String,
    required: true
  },
  
})


const Ride = mongoose.model('Ride', rideSchema);

export default Ride