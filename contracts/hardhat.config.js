require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const P_API = process.env.Polygon_API;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    mumbai :{
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
    }
  },
  etherscan:{
    apiKey: {
      polygonMumbai :P_API
  }},
  solidity: "0.8.18",
};
