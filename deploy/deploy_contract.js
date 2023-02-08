const { ethers } = require("hardhat")
const fs = require('fs');

async function deploy_general(signer,token_name,token_symbol){

  const nft_metadata = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXGeneral.sol/AVFXGeneral.json', 'utf-8'))

  const GeneralToken = new ethers.ContractFactory(nft_metadata.abi, nft_metadata.bytecode, signer)

  const NFT = await GeneralToken.deploy(token_name,token_symbol)

  await NFT.deployed()

  console.log("General 721 Token deployed to:", NFT.address)

  return(NFT.address)

}

async function deploy_rental(signer, token_name,token_symbol) {

  const nft_metadata = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXRent.sol/AVFXRent.json', 'utf-8'))

  const RentToken = new ethers.ContractFactory(nft_metadata.abi, nft_metadata.bytecode, signer)

  const NFT = await RentToken.deploy(token_name,token_symbol);

  await NFT.deployed();

  console.log("Rentable 4907 Token deployed to:", NFT.address);

  return(NFT.address)
}

module.exports = {
  deploy_general,
  deploy_rental
};





