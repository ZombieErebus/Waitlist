const setup = require('../setup.js');
const log = require('../logger.js')(module);
const users = require('../models/users.js')(setup);

module.exports = function (setup) {
	var module = {};
	//This nested if stuff is kinda unpleasant and I'd like to fix it
	module.refresh = function (req, res, next) {
		console.log(req.originalUrl.split('/')[2])
		if (!req.session.passport || !req.session.passport.user) {
			let uri = req.originalUrl.split('/');
			if(uri.length >= 1) {
				if(uri[1] == 'internal-api' || uri[1] == 'api'){
					res.status(401).send("Not authorised please login to continue. <a href='/auth/provider'>Login</a>");
					return;
				}
			}

			res.render("statics/login.html");
			return;
		}
		users.findAndReturnUser(req.session.passport.user.characterID, function (userData) {
			if (!userData) {
				req.logout();
				res.render("statics/login.html");
				return;
			} else {
				
				users.getMain(userData.characterID, function(mainUserData){
					users.getAlts(mainUserData.characterID, function(pilotArray){
						userData.role = mainUserData.role;
						userData.account.pilots = pilotArray.sort(function(a,b) {
							if(a.name > b.name) return 1;
							return -1;
						});
						userData.settings = mainUserData.settings;
						userData.waitlistMain = mainUserData.waitlistMain;
						req.session.passport.user = userData;
						req.session.save(function (err) {
							if (err) log.error("updateUserSession: Error for session.save", { err, 'characterID': user.characterID });
							next();
						});
					});
				});
			}
		});
	}

	return module;
}