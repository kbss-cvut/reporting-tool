# Reporting Tool

Reporting tool is a generic aviation safety occurrence reporting software. It is a lightweight version of a tool developed in the [INBAS](https://www.inbas.cz) project.

## Development Environment Setup

The following software needs to be installed on the system for development:

- JDK 8
- NodeJS v4 or later (can be installed using apt, in which case you need to install npm as well). To upgrade from older versions, see e.g. [https://davidwalsh.name/upgrade-nodejs](https://davidwalsh.name/upgrade-nodejs)
- Maven
- Apache Tomcat (or any other application server)

To start developing, first go to `app/root/src/main/webapp` and run `npm install`. This will download the necessary Node dependencies
(they are used by the UI written in ReactJS). You can check that everything is working by running `npm test`.
There are more commands for the UI, you can find them in `app/root/src/main/webapp/package.json`.

## Developing the Application

To run the application locally, start JS compile watcher by running `npm start` from `app/root/src/main/webapp`. The watcher will
recompile JS whenever a change is made to the UI code.

Another possibility is to tell the watcher to put the compiled bundle directly into `target/reporting-tool-$version$/js`, where it
is automatically picked up by Tomcat.

Running the application is simple, just build it with maven and deploy the artifact into you application server.

The "dev" maven profile is intended for development use, it contains non-minified version of the UI. The "production" profile contains
minified and uglyfied version of the UI and is more suitable for deployments where performance matters (the dev bundle has around 7MB, the production around 300kB).

## Storage Setup

The application by default uses a Sesame native storage as its database. The storage requires a folder somewhere on the file system. Path to that
folder is set up in `config.properties` in the application's resource. The relevant property is called _repositoryUrl_. Path to the
repository has to have the following pattern: `/some/path/repositories/repository-id`, where _repository-id_ is id of the repository.
Using a remote repository is of course also possible.

Of course, another repository can be specified, e.g. running on a Sesame server.

Other than the repository url, the config file also specifies URL of the Liferay portal (if present), which is used for user authentication.
If the portal is not accessible, the application will use its own user management.
OntoDriver is also specified here. Don't change it unless necessary. The last property - _eventTypeRepository_ - specifies URL of the 
repository which is queried for supported event types and other properties.
