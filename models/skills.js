const ObjectId = require('mongodb').ObjectID;
const db = require('../dbHandler.js').db.collection('skills');
const log = require('../logger.js')(module);

module.exports = function (setup) {
	var module = {};
    
    //Save new skills
    module.newSkillSet = (name, type, enabled, cb) => {
        try {
            db.insert({
                name: name,
                type: type,
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
                        skills.push({
                            "_id": docs[i]._id,
                            "name": docs[i].name,
                            "ships": docs[i].ships
                        });
                    }
                } catch (error) {
                    log.error("Models/Skills.getSkillSetList - ", error);
                }
                console.log(skills)
            }

            cb(skills);
        })
    
    }

    return module;
}