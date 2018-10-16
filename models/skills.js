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

    module.updateSettings = (id, name, hulls, filter, isPublic, cb) => {
        const hullsArray = hulls.split(',');

        //> To Do -- Get object for each ship {id, name}

        db.updateOne({_id: ObjectId(id)},  {$set: {
            "name": name,
            "filter": filter,
            "ships": null,
            "enabled": isPublic
        }}, (error, doc) => {
            if(error) {
                log.error("Models/Skills.updateSettings - ", error);
                cb(error);
                return;
            }
        });
    }

    return module;
}