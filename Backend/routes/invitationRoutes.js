import express from "express";
import {
    inviteUser,
    getOrganizationInvitations,
    getMyInvitations,
    acceptInvitation,
    declineInvitation,
    cancelInvitation
} from "../controllers/invitationController.js";

const invitationRouter = express.Router();

// Invitations addressed to the logged-in user, across all organizations
invitationRouter.get("/me", getMyInvitations);

// Invitations scoped to a specific organization
invitationRouter.post("/:orgId", inviteUser);
invitationRouter.get("/:orgId", getOrganizationInvitations);
invitationRouter.patch("/:orgId/accept", acceptInvitation);
invitationRouter.patch("/:orgId/decline", declineInvitation);
invitationRouter.delete("/:orgId/:userId", cancelInvitation);

export default invitationRouter;