import { z } from 'zod';
import { getAddressCoordinates, getDistanceAndTime, getInputSuggestions } from '../services/map.service.js'

async function getCoordinates(req,res) {
  const addressSchema = z.object({
    address: z.string().min(3, "Address ,ust be atleast 3 characters long")
  });
  
  try {
    const { address } = req.query;
    
    /* Input Validation */
    const validateAddress = addressSchema.parse({
      address
    });

    /* Getting Coordinates */
    const coordinates = await getAddressCoordinates(address);

    return res
    .status(200)
    .json({
      statusCode: 200,
      success: true,
      data: {
        coordinates
      },
      message: "User registered successfully. Please verify your email",
    });
  } catch (error) {
    
  }
}

async function getDistanceTime(req,res) {
  const pathSchema = z.object({
    pickup: z.string().min(3, "Address must be atleast 3 characters long"),
    destination: z.string().min(3, "Address ,ust be atleast 3 characters long"),
  });

  try{
    const { pickup, destination } = req.query;

    /* Input Validation */
    const validateAddress = pathSchema.parse({
      pickup,
      destination
    });

    const distanceTime = await getDistanceAndTime(pickup, destination);

    return res
    .status(200)
    .json({
      statusCode: 200,
      success: true,
      data: {
        d:''
      },
      message: "Distance and Time between given pickup and destination fetched successfully",
    });
  }catch(error){
    return res
    .status(500)
    .json({
      statusCode: 500,
      success: false,
      message: "Couldn't find Distance and Time between given points",
    });
  }
}

async function getSuggestions(req,res) {
  const inputSchema = z.object({
    input: z.string().min(3,'Input must be atleast 3 characters long')
  });

  try{
    const { input } = req.query;

    /* Input Validation */
    const validateInput = inputSchema.parse({
      input
    })

    const suggestions = await getInputSuggestions(input);

    return res
    .status(200)
    .json({
      statusCode: 200,
      success: true,
      data: {
        suggestions
      },
      message: "Suggestions fetched successfully",
    });
  } catch (err){
    return res
    .status(500)
    .json({
      statusCode: 500,
      success: false,
      message: "No Suggestions Found",
    });
  }
}



export { 
  getCoordinates, 
  getDistanceTime, 
  getSuggestions 
}