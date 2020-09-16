# CLOB - Central Limit Orderbook trading application

A full stack application, using React for the frontend and NodeJS for services, that implements POC of a Central Limit OrderBook (CLOB) stock trading marketplace.
It accepts orders via an REST API via UI or CLi clients and publishes updates on orderbook state changes. 

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
npm i
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
npm run i
npm start
```

## Run the application
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



