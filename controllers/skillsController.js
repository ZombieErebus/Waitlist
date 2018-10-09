var esi = require('eve-swagger');
var setup = require('../setup.js');
// var bans = require('../models/bans.js')(setup);
const users = require('../models/users.js')(setup);
const log = require('../logger.js')(module);


//Returns the Skills Managment page
exports.managementIndex = (req, res) => {
    if(!users.isRoleNumeric(req.user, 4)){
        req.flash("content", {"class":"error", "title":"Not Authorised!", "message":"Only our Senior FC team has access to that page! Think this is an error? Contact a member of leadership."});
        res.status(403).redirect("/");
        return;
    }

    let userProfile = req.user;
    let sideBarSelected = 7;
    res.render('pages/skills/managment.njk', {userProfile, sideBarSelected});
}