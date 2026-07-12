import mongoose from "mongoose";
import Organization from "../models/organisationSchema.js"; // adjust path to your model
import User from "../models/userSchema.js"; // adjust path to your model

// Maps an invitedUsers.role value to the array field it should land in
// once accepted. "Fleet Manager" has no array on the Organization model
// (there's only a single `owner`), so accepting a Fleet Manager invite
// just updates the User's role — it does not add them to an org array.
// If you want multiple fleet managers per organization, add a
// `fleetManagers: [ObjectId]` array to the Organization schema and map it here.
const ROLE_FIELD_MAP = {
    "Dispatcher": "dispatchers",
    "Safety Officer": "safetyOfficers",
    "Financial Analyst": "financialAnalysts"
};

const VALID_ROLES = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];

/**
 * @desc    Invite a user (by email) to an organization for a given role
 * @route   POST /api/organizations/:orgId/invitations
 * @access  Private (organization owner / Fleet Manager only)
 * Body: { email, role }
 */
export const inviteUser = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { email, role } = req.body;
        const requesterId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(orgId)) {
            return res.status(400).json({ success: false, message: "Invalid organization ID" });
        }

        if (!email || !role) {
            return res.status(400).json({ success: false, message: "Email and role are required" });
        }

        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({
                success: false,
                message: `Role must be one of: ${VALID_ROLES.join(", ")}`
            });
        }

        const organization = await Organization.findById(orgId);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        if (organization.owner.toString() !== requesterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the Fleet Manager (owner) can invite users"
            });
        }

        const invitedUser = await User.findOne({ email: email.toLowerCase().trim() });

        if (!invitedUser) {
            return res.status(404).json({
                success: false,
                message: "No user found with that email"
            });
        }

        if (invitedUser._id.toString() === organization.owner.toString()) {
            return res.status(400).json({
                success: false,
                message: "This user already owns the organization"
            });
        }

        const isAlreadyMember =
            organization.safetyOfficers.some((id) => id.toString() === invitedUser._id.toString()) ||
            organization.dispatchers.some((id) => id.toString() === invitedUser._id.toString()) ||
            organization.financialAnalysts.some((id) => id.toString() === invitedUser._id.toString());

        if (isAlreadyMember) {
            return res.status(400).json({
                success: false,
                message: "This user is already a member of the organization"
            });
        }

        const alreadyInvited = organization.invitedUsers.some(
            (invite) => invite.user.toString() === invitedUser._id.toString()
        );

        if (alreadyInvited) {
            return res.status(400).json({
                success: false,
                message: "This user has already been invited"
            });
        }

        organization.invitedUsers.push({ user: invitedUser._id, role });
        await organization.save();

        // TODO: send an email notification to invitedUser.email here

        return res.status(201).json({
            success: true,
            message: "Invitation sent successfully",
            data: organization.invitedUsers[organization.invitedUsers.length - 1]
        });
    } catch (error) {
        console.error("Error sending invitation:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send invitation",
            error: error.message
        });
    }
};

/**
 * @desc    Get all pending invitations for an organization
 * @route   GET /api/organizations/:orgId/invitations
 * @access  Private (organization owner only)
 */
export const getOrganizationInvitations = async (req, res) => {
    try {
        const { orgId } = req.params;
        const requesterId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(orgId)) {
            return res.status(400).json({ success: false, message: "Invalid organization ID" });
        }

        const organization = await Organization.findById(orgId).populate(
            "invitedUsers.user",
            "name email"
        );

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        if (organization.owner.toString() !== requesterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the Fleet Manager (owner) can view invitations"
            });
        }

        return res.status(200).json({
            success: true,
            count: organization.invitedUsers.length,
            data: organization.invitedUsers
        });
    } catch (error) {
        console.error("Error fetching invitations:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch invitations",
            error: error.message
        });
    }
};

/**
 * @desc    Get all pending invitations for the logged-in user, across all organizations
 * @route   GET /api/invitations/me
 * @access  Private
 */
export const getMyInvitations = async (req, res) => {
    try {
        const userId = req.user._id;

        const organizations = await Organization.find({ "invitedUsers.user": userId })
            .select("name location owner invitedUsers")
            .populate("owner", "name email");

        const myInvitations = organizations.map((org) => {
            const invite = org.invitedUsers.find(
                (inv) => inv.user.toString() === userId.toString()
            );
            return {
                organizationId: org._id,
                organizationName: org.name,
                location: org.location,
                owner: org.owner,
                role: invite.role,
                invitedUserEntryId: invite._id
            };
        });

        return res.status(200).json({
            success: true,
            count: myInvitations.length,
            data: myInvitations
        });
    } catch (error) {
        console.error("Error fetching your invitations:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your invitations",
            error: error.message
        });
    }
};

/**
 * @desc    Accept an invitation — moves the user into the correct role array
 *          (or updates their User.role if the invite was for "Fleet Manager"),
 *          updates the User's role field, and removes them from invitedUsers.
 * @route   PATCH /api/organizations/:orgId/invitations/accept
 * @access  Private (the invited user only)
 */
export const acceptInvitation = async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(orgId)) {
            return res.status(400).json({ success: false, message: "Invalid organization ID" });
        }

        const organization = await Organization.findById(orgId);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const inviteIndex = organization.invitedUsers.findIndex(
            (invite) => invite.user.toString() === userId.toString()
        );

        if (inviteIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "No pending invitation found for you in this organization"
            });
        }

        const { role } = organization.invitedUsers[inviteIndex];
        const arrayField = ROLE_FIELD_MAP[role];

        // Add to the relevant array (Fleet Manager has no array — see ROLE_FIELD_MAP comment)
        if (arrayField && !organization[arrayField].some((id) => id.toString() === userId.toString())) {
            organization[arrayField].push(userId);
        }

        // Remove the now-accepted invite
        organization.invitedUsers.splice(inviteIndex, 1);

        await organization.save();

        // Keep the User's role field in sync, same as organization creation does for owners
        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: `Invitation accepted. You are now a ${role} at ${organization.name}`,
            data: organization
        });
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to accept invitation",
            error: error.message
        });
    }
};

/**
 * @desc    Decline an invitation — simply removes the entry from invitedUsers
 * @route   PATCH /api/organizations/:orgId/invitations/decline
 * @access  Private (the invited user only)
 */
export const declineInvitation = async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(orgId)) {
            return res.status(400).json({ success: false, message: "Invalid organization ID" });
        }

        const organization = await Organization.findById(orgId);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const inviteIndex = organization.invitedUsers.findIndex(
            (invite) => invite.user.toString() === userId.toString()
        );

        if (inviteIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "No pending invitation found for you in this organization"
            });
        }

        organization.invitedUsers.splice(inviteIndex, 1);
        await organization.save();

        return res.status(200).json({
            success: true,
            message: "Invitation declined"
        });
    } catch (error) {
        console.error("Error declining invitation:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to decline invitation",
            error: error.message
        });
    }
};

/**
 * @desc    Cancel / revoke a pending invitation before it's accepted
 * @route   DELETE /api/organizations/:orgId/invitations/:userId
 * @access  Private (organization owner only)
 */
export const cancelInvitation = async (req, res) => {
    try {
        const { orgId, userId: invitedUserId } = req.params;
        const requesterId = req.user._id;

        if (
            !mongoose.Types.ObjectId.isValid(orgId) ||
            !mongoose.Types.ObjectId.isValid(invitedUserId)
        ) {
            return res.status(400).json({ success: false, message: "Invalid organization or user ID" });
        }

        const organization = await Organization.findById(orgId);

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        if (organization.owner.toString() !== requesterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the Fleet Manager (owner) can cancel invitations"
            });
        }

        const inviteIndex = organization.invitedUsers.findIndex(
            (invite) => invite.user.toString() === invitedUserId.toString()
        );

        if (inviteIndex === -1) {
            return res.status(404).json({ success: false, message: "Invitation not found" });
        }

        organization.invitedUsers.splice(inviteIndex, 1);
        await organization.save();

        return res.status(200).json({
            success: true,
            message: "Invitation cancelled"
        });
    } catch (error) {
        console.error("Error cancelling invitation:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel invitation",
            error: error.message
        });
    }
};