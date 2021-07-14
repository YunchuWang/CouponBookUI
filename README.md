Copoun UI:
=========================

Front end is served through webpack-server at https://localhost:3001 when running at dev mode. Back end is at localhost:8080

### Set up

* Make sure a local db called testdb is available for jooq
* Make sure a local db called localTest is available
* Run `gradle clean` to start with clean repo
* Run `gradle build` (output dir will be /build) to compile java and generate annotated code
* Run Spring Boot with VM option `-Dspring.profiles.active=dev` (check localhost:8080 to see if the back end is up)
* Run `npm run-script build` to generate static files (check /build/gen/npm/static)
* Run `npm run-script startDev` to start webpack server at local under dev mode
* Now you can go to localhost:8080 to see the webapp rendered by app.js + app.css. Also, you can go to localhost:8080/wrongpath to see the webapp rendered by appError.js + appError.css

Note, to better handle user login process, we may want to avoid using localhost:8080. You can set up an alias for localhost
