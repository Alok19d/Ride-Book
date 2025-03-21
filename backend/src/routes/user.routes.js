import { Router } from 'express';
import { authUser } from '../middlewares/auth.middlewares.js'
import { registerUser, verifyEmailAndLogin, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, changePassword, logoutUser } from '../controllers/user.controller.js'

const router = Router();

router.post('/register', registerUser);

router.get('/verify-email', verifyEmailAndLogin);

router.post('/login', loginUser);

router.get('/profile', authUser, getUserProfile)

// Not Completed
router.patch('/update-profile', authUser, updateUserProfile) 

router.post('/forgot-password', forgotPassword)

router.patch('/reset-password', resetPassword)

// Not Completed
router.patch('/change-password', changePassword) 

router.get('/logout', authUser, logoutUser)


export default router;