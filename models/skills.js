const ObjectId = require('mongodb').ObjectID;
const db = require('../dbHandler.js').db.collection('skills');
const esi = require('eve-swagger');
const log = require('../logger.js')(module);

module.exports = function (setup) {
	var module = {};
    
    //Save new skills
    module.newSkillSet = (name, filter, enabled, cb) => {
        try {
            db.insert({
                name: name,
                filter: filter,
                enabled: enabled,
                ships: [],
                skills: []
            });
        } catch(err) {
            cb(err);
            return;
        }

        cb();
    };

    //Returns skill lists according to the appropriate filters
    module.getSkillSetList = (filter, showDisabled, cb) => {
        let skills = [];
        
        db.find({}).toArray((error, docs) => {
            for(let i = 0; i < docs.length; i++) {
                try {
                    if((docs.published || showDisabled) && (!filter || filter == docs.type)) {
                        skills.push(docs[i]);
                    }
                } catch (error) {
                    log.error("Models/Skills.getSkillSetList - ", error);
                }
            }

            cb(skills);
        })
    
    }

    module.updateSettings = (id, name, hulls, filter, isPublic, cb) => {
        const hullsArray = hulls.split(',');
        hulls = [];


        for(let i = 0; i < hullsArray.length; i++){
            let hull = new Promise((resolve, reject) =>{
                module.lookupID(hullsArray[i], (data) => {
                    resolve(data);
                });
            })

            hulls.push(hull);
        }

        Promise.all(hulls).then((hulls) => {
            db.updateOne({_id: ObjectId(id)},  {$set: {
                "name": name,
                "filter": filter,
                "ships": hulls,
                "enabled": isPublic
            }}, (error) => {
                if(error) {
                    log.error("Models/Skills.updateSettings - ", error);
                    cb(error);
                    return;
                }

                cb();
            });
        })
    }

    module.deleteSet = (id, cb) => {
        db.remove({_id: ObjectId(id)}, function (error) {
            if(error) {
                log.error("Models/Skills.deleteSet - ", error);
                cb(error);
                return;
            }

            cb();
		})
    }

    module.updateSkill = (id, skillName, skillRequired, skillRecommended, cb) => {
        db.findOne({_id: ObjectId(id)}, (error, doc) => {
            if(error) {
                log.error("Models/Skills.updateSkill - ", error);
                cb(error);
                return;
            }

            var skills = doc.skills;
            //If the skill is present, let's update it!
            for(let i = 0; i < skills.length; i++) {
                if(skills[i].name == skillName) {
                    skills[i].required = skillRequired;
                    skills[i].recommended = skillRecommended;
                    

                    db.updateOne({_id: ObjectId(id)}, { $set: {
                        "skills": skills
                    }}, (error) => {
                        if(error) {
                            log.error("Models/Skills.updateSkill - ", error);
                            cb(error);
                            return;
                        }

                        cb();
                    });
                    return;
                }
            }

            //If not let's create it and add it
            module.lookupID(skillName, (skill) => {
                if(!skill) {
                    cb("No skill found");
                    return;
                }

                let newSkill = {
                    id: skill.id,
                    name: skill.name,
                    required: skillRequired,
                    recommended: skillRecommended
                }
                skills.push(newSkill);
                
                db.updateOne({_id: ObjectId(id)},  {$set: {
                    "skills": skills
                }}, (error) => {
                    if(error) {
                        log.error("Models/Skills.updateSkill - ", error);
                        cb(error);
                        return;
                    }
    
                    cb();
                });
            })	
        })      
    }

    module.removeSkill = (setID, skillName, cb) => {
        db.findOne({_id: ObjectId(setID)}, (error, doc) => {
            if(error) {
                log.error("Models/Skills.updateSkill - ", error);
                cb(error);
                return;
            }

            var skills = doc.skills;
            var newSkills = [];
            //If the skill is present, let's update it!
            for(let i = 0; i < skills.length; i++) {
                if(skills[i].name != skillName) {
                    newSkills.push(skills[i]);                  
                }
            }

            db.updateOne({_id: ObjectId(setID)},  {$set: {
                "skills": newSkills
            }}, (error) => {
                if(error) {
                    log.error("Models/Skills.removeSkill - ", error);
                    cb(error);
                    return;
                }

                cb();
            });
        })         
    }

    module.lookupID = (searchWord, id) => {
        esi.types.search.strict(searchWord).then((results) => {
            id({id: results[0], name: searchWord});            
        }).catch((error) => {
            log.error("Models/Skills.lookupID - ", error);
            id(null);
        });
    };

    return module;
}