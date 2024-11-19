var esi = require('../esi.js').makeAPI();
var setup = require('../setup.js');
const users = require('../models/users.js')(setup);
const skills = require('../models/skills.js')(setup);
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

//Save the new skill set
exports.newSkillSet = (req, res) => {
    if(!users.isRoleNumeric(req.user, 4)){
        res.status(403).send("Not Authorised");
        return;
    }

    skills.newSkillSet(req.body.name, req.body.type, false, (err) => {
        if(err) {
            log.error("controler/Skills - newSkillSet: ", err);
            res.status(400).send();
            return;
        }

        res.status(200).send();
    });
}


exports.getManagmentState = (req, res) => {
    if(!users.isRoleNumeric(req.user, 4)){
        res.status(403).send("Not Authorised");
        return;       
    }

    var package = {}
    module.getSkillLists(req.user, true, req.body.filter, (skillList)=> {
        package.list = skillList;

        res.status(200).send(package);
    })
}

exports.updateSettings = (req, res) => {
    if(!users.isRoleNumeric(req.user, 4)){
        res.status(403).send("Not Authorised");
        return;
    }

    skills.updateSettings(req.params.setID, req.body.name, 
        req.body.hulls, req.body.filter, req.body.isPublic, (cb) => {
            if(cb){
                res.status(400).send(cb);
                return;
            }
        res.status(200).send();
    });
    
}

exports.deleteSet = (req, res) => {
    if(!users.isRoleNumeric(req.user, 4)){
        res.status(403).send("Not Authorised");
        return;
    }

    skills.deleteSet(req.params.setID, (err) => {
        if(err) {
            log.error("controler/Skills - deleteSkillSet: ", err);
            res.status(400).send();
            return;
        }

        res.status(200).send();
    })
}

exports.updateSkills = (req, res) => {
    if(!users.isRoleNumeric(req.user, 4)){
        res.status(403).send("Not Authorised");
        return;
    }
    
    skills.updateSkill(req.params.setID, req.body.name, req.body.required, req.body.recommended, (err) => {
        if(err) {
            log.error("controler/Skills - updateSkills: ", err);
            res.status(400).send(err);
            return;
        }

        res.status(200).send();
    });
    
}

exports.removeSkill = (req, res) => {
    if(!users.isRoleNumeric(req.user, 4)){
        res.status(403).send("Not Authorised");
        return;
    }
    
    skills.removeSkill(req.params.setID, req.body.skillName, (err) => {
        if(err){
            log.error("controler/Skills - removeSkill: ", err);
            res.status(400).send(err);
            return;
        }
        
        res.status(200).send();
    })
    res.status(200).send();
}

module.getSkillLists = (user, managmentView, filter, cb) => {
    var showDisabled = (managmentView && users.isRoleNumeric(user, 4)) ? true : false;
    
    try {
        skills.getSkillSetList(filter, showDisabled, (data) => {
            cb(data, null)
        });
    } catch(error) {
        cb(null, error)
    }
}