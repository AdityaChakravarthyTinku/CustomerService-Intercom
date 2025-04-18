
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Profile = require('../models/Profile');
const router = express.Router();

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone number validation regex (digits only, 10-15 characters)
const phoneRegex = /^[0-9]{10}$/;

// Get User Profile
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
});

// Add Profile with Validation
router.post("/addprofile", protect, async (req, res) => {
    try {
        const { name, email, phone, address1, address2, instagram, youtube, linkedin, github } = req.body;

        // Validate Email
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate Phone (if provided)
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. It should contain only digits and be 10 characters long" });
        }

        console.log("Received Profile Data:", name, email, phone, address1, address2, instagram, youtube, linkedin, github);

        let userProfile = await Profile.findOne({ userId: req.user.id });

        if (!userProfile) {
            userProfile = new Profile({
                userId: req.user.id,
                profiles: [{ name, email, phone, address1, address2, instagram, youtube, linkedin, github }],
            });
        } else {
            if (!Array.isArray(userProfile.profiles)) {
                userProfile.profiles = [];
            }

            const isDuplicate = userProfile.profiles.some(profile => profile.email === email);
            if (isDuplicate) {
                return res.status(400).json({ message: "Profile with this email already exists" });
            }

            userProfile.profiles.push({ name, email, phone, address1, address2, instagram, youtube, linkedin, github });
        }

        await userProfile.save();
        res.status(201).json({ message: "Profile added successfully", profile: userProfile });
    } catch (error) {
        console.error("Error adding profile:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get Profiles for the Authenticated User
router.get("/myprofiles", protect, async (req, res) => {
    try {
        const profiles = await Profile.find({ userId: req.user.id });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Update Profile with Validation
router.put("/profiles/:profileId", protect, async (req, res) => {
    try {
        const { profileId } = req.params;
        const userId = req.user.id;
        const { email, phone } = req.body;

        // Validate Email
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate Phone (if provided)
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. It should contain only digits and be 10 characters long" });
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId, "profiles._id": profileId },
            { $set: { "profiles.$": req.body } },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Error updating profile" });
    }
});

// Delete Profile
router.delete("/profiles/:profileId", protect, async (req, res) => {
    try {
        const { profileId } = req.params;
        const userId = req.user.id;

        console.log("Deleting Profile:", userId, profileId);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user ID found" });
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { $pull: { profiles: { _id: profileId } } },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json({ message: "Profile deleted successfully", updatedProfile });
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
