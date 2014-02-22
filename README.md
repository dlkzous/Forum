# Forum
### a Sails application

Forum is a simple web based application created using the Sailsjs web framework.

Installation:

Install [sails](http://sailsjs.org/#!getStarted).

Code currently configured to use mongodb adapter.
Set up mongodb on your local system.
Add a new database with the following commands on the mongo CL:
Create db:
```
mongo> db.createCollection("forum")
```

Ensure db is created by running:
```
mongo> show dbs
```

Use the hlu_forum db by running:
```
mongo> use forum
```

Create a new user with the following command:
```
mongo> db.addUser( {user: "team", pwd: "password", roles: ["readWrite", "dbAdmin"] })
```

Install the grunt sails linker as is shown here https://github.com/Zolmeister/grunt-sails-linker

Ensure that the mongo daemon is running before running the following command:
```
sails lift
```

In order to use node-inspector as a debugger, run the application as follows:

```
node --debug app.js
```

Then run node inspector as follows:
```
node-debug app.js
```
