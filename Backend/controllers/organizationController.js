import mongoose from "mongoose";
import Organization from "../models/organisationSchema.js"; // adjust path to your model
import User from "../models/userSchema.js"; // adjust path to your model

/**
 * @desc    Create a new organization
 * @route   POST /api/organizations
 * @access  Private (any authenticated user)
 *
 * The creator automatically becomes the "owner" of the organization,
 * and their User.role is updated to "Fleet Manager".
 */
export const createOrganization = async (req, res) => {
    try {
        const { name, description, location } = req.body;
        const userId = req.user._id;

        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: "Name and location are required"
            });
        }

        // Create organization
        const organization = await Organization.create({
            name,
            description,
            location,
            owner: userId
        });

        // Update user's role and organization
        await User.findByIdAndUpdate(
            userId,
            {
                role: "Fleet Manager",
                organizationId: organization._id
            },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Organization created successfully",
            data: organization
        });

    } catch (error) {
        console.error("Error creating organization:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create organization",
            error: error.message
        });
    }
};

/**
 * @desc    Get all organizations (optionally only the ones the user belongs to)
 * @route   GET /api/organizations
 * @access  Private
 */
export const getAllOrganizations = async (req, res) => {
    try {
        const { mine } = req.query; // ?mine=true -> only orgs related to req.user
        const userId = req.user?._id;

        let filter = {};

        if (mine === "true" && userId) {
            filter = {
                $or: [
                    { owner: userId },
                    { safetyOfficers: userId },
                    { dispatchers: userId },
                    { financialAnalysts: userId },
                    { "invitedUsers.user": userId }
                ]
            };
        }

        const organizations = await Organization.find(filter)
            .populate("owner", "name email role")
            .populate("safetyOfficers", "name email role")
            .populate("dispatchers", "name email role")
            .populate("financialAnalysts", "name email role")
            .populate("invitedUsers.user", "name email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: organizations.length,
            data: organizations
        });
    } catch (error) {
        console.error("Error fetching organizations:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch organizations",
            error: error.message
        });
    }
};

/**
 * @desc    Get a single organization by ID
 * @route   GET /api/organizations/:id
 * @access  Private
 */
export const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid organization ID"
            });
        }

        const organization = await Organization.findById(id)
            .populate("owner", "name email role")
            .populate("safetyOfficers", "name email role")
            .populate("dispatchers", "name email role")
            .populate("financialAnalysts", "name email role")
            .populate("invitedUsers.user", "name email role");

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: organization
        });
    } catch (error) {
        console.error("Error fetching organization:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch organization",
            error: error.message
        });
    }
};

/**
 * @desc    Update an organization (name, description, location)
 * @route   PATCH /api/organizations/:id
 * @access  Private (owner only)
 */
export const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { name, description, location } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid organization ID"
            });
        }

        const organization = await Organization.findById(id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        if (organization.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the organization owner can update this organization"
            });
        }

        if (name !== undefined) organization.name = name;
        if (description !== undefined) organization.description = description;
        if (location !== undefined) organization.location = location;

        await organization.save();

        return res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            data: organization
        });
    } catch (error) {
        console.error("Error updating organization:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update organization",
            error: error.message
        });
    }
};

/**
 * @desc    Delete an organization
 * @route   DELETE /api/organizations/:id
 * @access  Private (owner only)
 */
export const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid organization ID"
            });
        }

        const organization = await Organization.findById(id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        if (organization.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the organization owner can delete this organization"
            });
        }

        await organization.deleteOne();

        // Optional: revert owner's role back to a default role, e.g. "User"
        // await User.findByIdAndUpdate(userId, { role: "User" });

        return res.status(200).json({
            success: true,
            message: "Organization deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting organization:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete organization",
            error: error.message
        });
    }
};

/**
 * @desc    Remove a member (safety officer, dispatcher, financial analyst) from an organization
 * @route   PATCH /api/organizations/:id/members/remove
 * @access  Private (owner only)
 *
 * Body: { userId: "<id>", role: "Safety Officer" | "Dispatcher" | "Financial Analyst" }
 * Included alongside core CRUD since removing members is a common companion
 * operation to updating an organization, and mirrors how invitationsController.js
 * will add members via invitedUsers.
 */
export const removeOrganizationMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId: memberId, role } = req.body;
        const requesterId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(memberId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid organization or user ID"
            });
        }

        const roleFieldMap = {
            "Safety Officer": "safetyOfficers",
            "Dispatcher": "dispatchers",
            "Financial Analyst": "financialAnalysts"
        };

        const field = roleFieldMap[role];

        if (!field) {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });
        }

        const organization = await Organization.findById(id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        if (organization.owner.toString() !== requesterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the organization owner can remove members"
            });
        }

        organization[field] = organization[field].filter(
            (uid) => uid.toString() !== memberId.toString()
        );

        await organization.save();

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
            data: organization
        });
    } catch (error) {
        console.error("Error removing member:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove member",
            error: error.message
        });
    }
};