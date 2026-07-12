const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user?.role;

        if(!userRoles) return res.sendStatus(401);

        const rolesArray = [...allowedRoles];

        const result = userRoles.map(role => rolesArray.includes(role)).find(val => val === true);

        if(!result) return res.sendStatus(401);

        next();
    }
}

export default verifyRoles;