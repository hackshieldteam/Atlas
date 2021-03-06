# Atlas
An API used to manage information in a Security Operations Center (SOC).

## Pre-requisites
You must have one database tool like PostgreSQL installed on your machine to turn on Atlas application.

1) Install PostgreSQL or another BBDD tool.
2) Create a database on the tool.
3) Check that the database is working properly.

## Getting started

### Installing dependencies
First of all, you need to download gitlab repository and install all the dependencies with
by typing the command below:

```
npm install
```

### Development server

#### Configure database connection
At the first time, you must configure the connection to the database in the
file ``.env`` at the root path.

An example of configuration to connect to a PostgreSQL database: 

````$xslt
DB_USER=postgresql          
DB_PORT=5432 // Database port on your machine
DB_HOST=localhost                   
DB_PASSWORD=postgresql              
DB_DATABASE=database_name_example  
PORT=5000   // Microservice port to start server
JWT_SECRET=WhateverStringYouWantBecauseIsOnDevelopment
````

#### Start server

Run the command below: 
```
npm run dev
```
This will create all the database tables if is the first time and start the 
development server on port.



