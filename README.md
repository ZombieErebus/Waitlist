# eve-goons-waitlist
The ESI-enabled ajax-based waitlist used by the Incursions squad in Goonfleet of Eve Online.

### Prerequisites

* You will need an application created at https://developers.eveonline.com
* For local development with the default settings, set your callback url to http://localhost:8113/auth/provider/callback
* You can see a list of scopes that the application requires in `setup.js` https://github.com/samuelgrant/eve-goons-waitlist/blob/development/setup.js#L5

### Installation and Setup
* Clone repo
* Run `npm install` to grab dependencies
* Install a MongoDB instance, for example by downloading and installing the community edition from here https://www.mongodb.com/download-center/community
* Copy the .env.example file to .env `cp .env.example ./.env`

#### Required .env Entries (Set these in your newly created .env file)
```
#ESI 
API_CLIENT_ID=<client id from developers.eveonline.com>
API_SECRET_KEY=<client secret from developers.evenonline.com>
OAUTH_CALLBACK_URL=<can be unset, defaults to http://localhost:8113/auth/provider/callback >

#Mongo
MONGO_DB=<Leave unset, default to EveGoonsWaitlist>
MONGODB_URI=<can be unset, defaults to localhost:27017 which is the default when you install MongoDB>

#APP Settings
SESSION_SECRET=<set it to anything, MUST BE SECURE WHEN USING IN PRODUCTION>
PRODUCTION=false
USE_INLINE_SCHEDULER=true
```


* Run with `node index.js`.