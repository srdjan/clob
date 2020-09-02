# CLOB
Central Limit Orderbook trading application
A full stack application, with the React frontend and node.js service that implements a Central Limit Orderbook (CLOB). 
It accepts orders via a REST (or WebSocket API) and publishes updates on orderbook state changes or if trades occur. 

### Installation

1) Start by cloning the repo locally and navigate to newly created folder:

```sh
git clone https://github.com/srdjan/clob/.git   
cd clob
```

2)  Next, install dependencies and build the project:

```sh
npm i
npm run build
```

3) On a succesful build, try running tests:

```sh
npm start
npm run test
```

