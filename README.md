# Toy Trading Aapplication

A full stack application, using React for the frontend and NodeJS for services, implements a simple trading marketplace
for spacerocks! :)
It accepts orders via an REST API via the UI client and publishes realtime updates to all looged in clients as the orderbook state changes. 

### Installation

## API
1) Start by cloning the repo locally and navigate to newly created folder:
```sh
git clone https://github.com/srdjan/clob.git   
cd clob
```
2)  Next, for API development change directory to ./api, install dependencies and build the project:
```sh
cd api/
npm install
npm run build
```
3) On a succesful build, try running tests:
```sh
npm run test:unit
```
for unit tests, or:
```
npm run test:accept
```
for acceptance tests.

## UI
For UI development change directory to ./ui, install dependencies and build the project:
```sh
cd ui
npm install
npm start
```

## To run the application
Use two different command shells. First start the services:
```
[clob]> cd api
[clob/api]> npm start
```
### ... and then the frontend:
```sh
[clob/api]> cd ../ui
[clob/ui]> npm start
```



