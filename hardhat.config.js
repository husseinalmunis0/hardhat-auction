require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "ganache",
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545"
    },
    ganache: {
      url: "http://localhost:7545",
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },

};
