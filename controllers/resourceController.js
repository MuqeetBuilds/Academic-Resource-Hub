const Resource = require('../models/Resource');

// 1. UPLOAD A NEW RESOURCE (For Seniors)
exports.uploadResource = async (req, res) => {
    try {
        const { title, subject, semester } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload a PDF or DOC file' });
        }

        const newResource = new Resource({
            title,
            subject,
            semester,
            fileUrl: req.file.path, // Saves the path to the file in the uploads folder
            uploadedBy: req.user.userId || req.user.id, // Handles both token payload styles
            status: 'pending' // 🔒 Securely locked to pending. Hidden until teacher verifies.
        });

        await newResource.save();
        res.json({ msg: 'Resource uploaded successfully. Waiting for teacher verification.', resource: newResource });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// 2. VERIFY A RESOURCE (For Teachers)
exports.verifyResource = async (req, res) => {
    try {
        const { status, teacherComments } = req.body; // status should be 'verified' or 'rejected'

        let resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ msg: 'Resource not found' });

        resource.status = status;
        resource.verifiedBy = req.user.userId || req.user.id;
        if (teacherComments) resource.teacherComments = teacherComments;

        await resource.save();
        res.json({ msg: `Resource ${status} successfully`, resource });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// 3. GET ALL RESOURCES (For the Dashboard)
exports.getResources = async (req, res) => {
    try {
        let dbQuery = {}; // Default: fetch nothing until we check the role

        // 🚨 THE FIX: Secure Backend Role Filtering
        if (req.user && req.user.role === 'junior') {
            // Juniors strictly ONLY get 'verified' notes from the database
            dbQuery = { status: 'verified' };
        } 
        else if (req.user && req.user.role === 'senior') {
            // Seniors get 'verified' notes AND their own 'pending' uploads
            dbQuery = { 
                $or: [
                    { status: 'verified' },
                    { uploadedBy: req.user.userId || req.user.id }
                ]
            };
        } 
        else if (req.user && req.user.role === 'teacher') {
            // Teachers get absolutely everything (query stays empty {}) so they can verify them
            dbQuery = {}; 
        }

        // Fetches notes based on the strict security query and sorts them by newest first
        const resources = await Resource.find(dbQuery).sort({ date: -1 });
        res.json(resources);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};