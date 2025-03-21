import { Router } from "express";
import { authUser, authCaptain } from '../middlewares/auth.middlewares.js'
import { createRide } from '../controllers/ride.controller.js'

const router = Router();

router.get('/get-fare', authUser, createRide);

router.post('/create', authUser, createRide);

router.post('/confirm', authCaptain, createRide);

router.get('/start-ride', authCaptain, createRide);

router.post('/finish-ride', authCaptain, createRide);


export default router;