require('dotenv').config()
// mandatory setup.js
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
if (!fs.existsSync(path.normalize(__dirname + "/setup.js"))) {
	throw "You need to create a setup.js file. Refer to the readme."
}

const setup = require('./setup.js');
const log = require('./logger.js')(module);
const database = require('./dbHandler.js');

const express = require('express');
const passport = require('passport');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const flash = require('req-flash');

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
	dsn: setup.sentry.privateDsn,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
	],
	tracesSampleRate: 1.0,
});

//Apparently JS has a shit fit when it can't throw errors properly so uh, we need to make it throw errors properly
process.on('uncaughtException', function(exception) {
	console.log(exception);
})
process.setMaxListeners(0);

database.connect(function () {
    
	//Custom imports
	require('./oauth/provider');

	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
    
    /* Force HTTPS On Production */
    const sslRedirect = require('heroku-ssl-redirect');
    app.use(sslRedirect());
    
    const morgan = require('morgan');
    app.use(morgan('tiny'));
    
	app.use(session({
		store: new mongoStore({ db: database.db }),
		secret: setup.data.sessionSecret,
		cookie: { maxAge: 604800 * 1000 }, //Week long cookies for week long incursions!
		resave: true,
		saveUninitialized: true
	}))

	app.use(cookieParser());
	app.use(session({ secret: setup.data.sessionSecret }));
	app.use(flash({ locals: 'flash' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(bodyParser.urlencoded({ extended: true }));
			
	/* Middleware Checks */
    app.use('/includes', express.static('public/includes'));//Exempt
    app.use('/compiled-react', express.static('compiled-react'));//Exempt
	app.use(/\/((?!auth).)*/, require('./middleware/userSession.js')(setup).refresh);
	app.use(/\/((?!auth).)*/, require('./middleware/ban.js')(setup).check);
	app.use(/\/((?!auth).)*/, require('./middleware/whitelist.js')(setup).check);
	app.use(/\/((?!auth).)*/, require('./middleware/logout.js')(setup).check);

	const nunkucksApi = nunjucks.configure('resources/views', {
		autoescape: true,
		express: app
	});

	nunjucksApi.addGlobal('sentry', setup.sentry);

	//Routes
	require('./oauth/oAuthRoutes.js')(app, passport, setup);
	var routeListen = require('./routes.js');
	app.use(routeListen)

	//Longpolling
	const longpoll = require("express-longpoll")(app, {
		DEBUG: false,
	});
	//Create longpoll routes
	longpoll.create("/poll/:id", (req, res, next) => {
		req.id = req.params.id;
		next();
    });	
    
    // Due to limitations on heroku, we will run the scheduler in the same process as the web server
    if (!!process.env.USE_INLINE_SCHEDULER) {
        log.info("Running Scheduler inline with web process!");
        const scheduler = require('./scheduler');
	}
	
	app.use(Sentry.Handlers.errorHandler());

	//Configure Express webserver
	app.listen(setup.settings.port, function listening() {
		log.info('Express online and accepting connections');
    });
});