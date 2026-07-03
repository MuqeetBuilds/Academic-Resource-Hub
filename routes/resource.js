const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Correctly importing the 3 functions from the controller
const { uploadResource, verifyResource, getResources } = require('../controllers/resourceController');

// 1. Setup Multer Storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Only allow PDF and DOC/DOCX files, max 10MB
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOC/DOCX files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 2. Define Routes

// @route   POST /api/resources/upload
// @desc    Upload a new resource (Senior only)
router.post('/upload', auth, roleAuth('senior'), upload.single('file'), uploadResource);

// @route   PUT /api/resources/:id/verify
// @desc    Verify or reject a resource (Teacher only)
router.put('/:id/verify', auth, roleAuth('teacher'), verifyResource);

// @route   GET /api/resources
// @desc    Get all notes for the Dashboard (Filtering happens in the controller)
router.get('/', auth, getResources); 

module.exports = router;