const express = require('express');
const router = express.Router();
const commander_controller = require('./controllers/commanderController.js');
const admin_bans_controller = require('./controllers/adminBansController.js');
const admin_fcs_controller = require('./controllers/adminCommandersController.js');
const admin_whitelist_controller = require('./controllers/adminWhitelistController.js');
const api_controller = require('./controllers/apiController.js');
const pilot_settings_controller = require('./controllers/pilotSettingsController.js');
const fc_tools_controller = require('./controllers/fcToolsController.js');
const statsController = require('./controllers/statisticsController.js');
const waitlistController = require('./controllers/waitlistController.js');
const fleetsController = require('./controllers/fleetController.js');
const skills_controller = require('./controllers/skillsController.js');

	//Public Pages
	router.get('/', waitlistController.index);
	router.get('/logout', function(req, res){
		req.logout();
		res.status(401).redirect(`/`);
	});

	// router.get('/squad-statistics', statsController.index);

	//Waitlist Routes
	router.post('/join/:type', waitlistController.signup);
	router.post('/remove/:type/:characterID', waitlistController.selfRemove)


	//Pilot Settings
	router.get('/my-settings', pilot_settings_controller.index);
	router.post('/my-settings/jabber', pilot_settings_controller.jabber);

	//Commander - Fleets
	router.get('/commander', commander_controller.index);
	router.post('/commander', commander_controller.registerFleet);
	router.delete('/commander/:fleetID', fleetsController.delete);

	//Commander - FC Waitlist Management
	router.get('/commander/:fleetID/', fleetsController.index);
	router.post('/commander/:fleetid/update/info', fleetsController.getInfo);	
	router.post('/commander/admin/alarm/:characterID/:fleetID', waitlistController.alarm);//501
	router.post('/commander/admin/invite/:characterID/:fleetID', fleetsController.invite);
	router.post('/commander/admin/remove/:characterID', waitlistController.removePilot);

	//Commander - FC Tools
	router.get('/commander/tools/fits-scan', fc_tools_controller.fitTool);
	router.get('/commander/tools/waitlist-logs', fc_tools_controller.waitlistLog);
	router.get('/commander/:pilotname/skills', fc_tools_controller.skillsChecker);
	//Commander - Search for pilot
	router.get('/commander/:pilotname/profile', fc_tools_controller.pilotSearch);//View
	router.post('/search', fc_tools_controller.searchForPilot);//ajax search

	router.post('/internal-api/:pilot/logout', fc_tools_controller.logUserOut);
	router.post('/internal-api/:pilot/role/:title', fc_tools_controller.setTitle);
	
	router.post('/commander/:pilotID/comment', fc_tools_controller.addComment);//Add a comment

	//Admin - Bans Management
	router.get('/admin/bans', admin_bans_controller.index);
	router.post('/admin/bans', admin_bans_controller.createBan);
	router.get('/admin/bans/:banID', admin_bans_controller.revokeBan);
	//Admin - FC Management
	router.get('/admin/commanders', admin_fcs_controller.index);
	router.post('/admin/commanders/update', admin_fcs_controller.updateUser);
	

	//Admin - Whitelist Management
	router.get('/admin/whitelist', admin_whitelist_controller.index);
	router.post('/admin/whitelist', admin_whitelist_controller.store);
	router.get('/admin/whitelist/:whitelistID', admin_whitelist_controller.revoke);
	
	
	//Interacts with the users client via ESI.
	router.post('/esi/ui/waypoint/:systemID', api_controller.waypoint);
	router.post('/esi/ui/info/:targetID', api_controller.showInfo);
	router.post('/internal-api/v2/esi-ui/market', api_controller.openMarket);

	//App API endpoints
	router.post('/internal-api/fleetcomp/:fleetid/:filter', api_controller.fleetAtAGlance);
	router.post('/internal-api/waitlist/remove-all', waitlistController.clearWaitlist);
	router.post('/internal-api/waitlist/pilots/:characterID', waitlistController.pilotStatus);
	router.post('/internal-api/banner', api_controller.addBanner);
	router.post('/internal-api/banner/:_id', api_controller.removeBanner);
	router.post('/internal-api/account/navbar', api_controller.navbar);
	router.post('/internal-api/fleets', fleetsController.getFleetJson);
	router.get('/internal-api/fleet/:fleetID/members', fleetsController.getMembersJson);

	router.get('/internal-api/v2/waitlist', waitlistController.pilotWaitlistState);

	//FC Fleet Managment
	router.get('/internal-api/v2/fleet/:fleetID', fleetsController.getState);
	router.post('/internal-api/v2/fleet/:fleetID/backseat', fleetsController.updateBackseat);
	router.post('/internal-api/v2/fleet/:fleetID/commander', fleetsController.updateCommander);
	router.post('/internal-api/v2/fleet/:fleetID/comms', fleetsController.updateComms);
	router.post('/internal-api/v2/fleet/:fleetID/status', fleetsController.updateStatus);
	router.post('/internal-api/v2/fleet/:fleetID/type', fleetsController.updateType);
	
	//invite
	//remove
	//alarm
	//closeTheFleet
	//clearTheWaitlist

	//Admin Skills
	router.get('/admin/skills', skills_controller.managementIndex);
	router.post('/internal-api/v2/skills-managment', skills_controller.newSkillSet);
	router.get('/internal-api/v2/skills-managment', skills_controller.getManagmentState);
	router.post('/internal-api/v2/skills-managment/:setID', skills_controller.updateSkills);
	router.put('/internal-api/v2/skills-managment/:setID', skills_controller.updateSettings);
	router.delete('/internal-api/v2/skills-managment/:setID', skills_controller.deleteSet);
	router.patch('/internal-api/v2/skills-managment/:setID', skills_controller.removeSkill);
	
	//External - APIs
	// router.get('/api/sstats/members', statsController.getMemberList);
	// router.get('/api/sstats/corporations', statsController.getCorporationList);
	// router.get('/api/sstats/member-registration', statsController.getMontlySignups);//Todo make object array with monthName and count.

	module.exports = router;