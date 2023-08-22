import { HardhatUserConfig } from "hardhat/config";
import 'hardhat-deploy'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-gas-reporter'
const config: HardhatUserConfig = {
  solidity: '0.8.19',
}

export default config;
