require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = "7e0dd21cba3952c769b9a90376893a351d4ac356aeacd0e537f5022e08593528"

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "avalanche_fuji",
  networks: {
    avalanche_fuji: {
      url: "https://avalanche-fuji.infura.io/v3/af80fbafec67441595f581fbeb7c8f1e", //"https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
