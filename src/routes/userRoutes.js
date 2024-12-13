const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser, getEnrolledCourses, enrollInCourse, getUserProfile, updateUserProfile } = require('../controllers/userController');
const {requireAuth} = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// All routes protected by authentication middleware
router.use(requireAuth());

// Routes with Role-Based Access Control
router.get('/getAllUsers', roleMiddleware(['admin']), getAllUsers); // Admin only
router.get('/getUserById/:id', roleMiddleware(['admin', 'instructor']), getUserById); // Admin/Instructor
router.put('/updateUser/:id', roleMiddleware(['admin', 'instructor']), updateUser); // Admin/Instructor
router.delete('/deleteUser/:id', roleMiddleware(['admin']), deleteUser); // Admin only
router.get('/getUserProfile', roleMiddleware(['admin', 'student', 'instructor']), getUserProfile);// Get user profile
router.put('/updateUserProfile', roleMiddleware(['admin', 'student', 'instructor']), updateUserProfile);// Update student profile
router.get('/getEnrolledCourses', roleMiddleware(['student', 'admin']), getEnrolledCourses);// Get enrolled courses
router.post('/enrollInCourse/:courseId', roleMiddleware(['student', 'admin']), enrollInCourse);// Enroll in a course

module.exports = router;
