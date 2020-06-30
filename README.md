# Global Conflict Analysis Platform

Data Visualization frontend that is deployable on both [Heroku](https://www.heroku.com/) and [SAP Cloud Platform](https://cloudplatform.sap.com/index.html)

## Requirements
* [Mapbox](https://www.mapbox.com/) API key
* [SAP HANA](https://www.sap.com/products/hana.html) Instance Information
    * Host
    * Port
    * Username
    * Password
* [node.js](https://nodejs.org/en/) for local development
* [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/) for deployment on SAP Cloud Platform

## Deploy
* Add the following environment variables to `$HOME/.bashrc` or `$HOME/.profile`. These are **example** values only.

``` bash
# Required for application
export HDB_HOST=99.11.000.555
export HDB_PORT=10099
export HDB_USER=hanaUser
export HDB_PASSWORD=1hanaPassword
export MAPBOX_TOKEN=pk.veryLongValue

# For deployment on SAP Cloud Platform
export CP_USER=i999888
export CP_PASSWORD=MyPlatformPass
```

### Local
* Install dependencies and then run

```bash
npm install
npm run start
```
* Application with be available at [http://localhost:3000](http://localhost:3000)

### SAP Cloud Platform
* Login with the `cf-login.sh` script
* Push the application using the node.js [buildpack](https://docs.cloudfoundry.org/buildpacks/node/index.html) with `cf-push-buildpack.sh`