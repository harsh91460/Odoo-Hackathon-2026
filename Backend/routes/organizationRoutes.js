import express from "express";
import {
    createOrganization,
    getAllOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    removeOrganizationMember
} from "../controllers/organizationController.js";

const organizationRouter = express.Router();

organizationRouter.route("/")
    .post(createOrganization)
    .get(getAllOrganizations);

organizationRouter.route("/:id")
    .get(getOrganizationById)
    .patch(updateOrganization)
    .delete(deleteOrganization);

organizationRouter.patch("/:id/members/remove", removeOrganizationMember);

export default organizationRouter;