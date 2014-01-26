# Forum
### a Sails application

Forum is a simple web based application created using the Sailsjs web framework.

Usage:
Install sails using instructions provided here http://sailsjs.org/#!getStarted

Currently configured to use mongodb adapter.
Set up mongodb on your local system.
Add a new database called hlu_forum with the following commands on the mongo CL
Create db: db.createCollection("hlu_forum")
Ensure db is created by running: show dbs
Use the hlu_forum db by running: use hlu_forum
Create a new user with the following command:
db.addUser( "teamhlu", "T1tct!utle",  roles: ["readWrite", "dbAdmin"] )

