const fs = require('fs');
const { ethers } = require("hardhat")

async function mintGeneralNFT(token_address,ipfsHash,signer) {

    const GeneralToken = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXGeneral.sol/AVFXGeneral.json', 'utf-8'))

    console.log("Minting General NFT...")

    const contract = new ethers.Contract(token_address, GeneralToken.abi, signer)

    const transaction = await contract.mint(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
    await transaction.wait()

    const tokenCounter = await contract.tokenCounter()

    return(`Contract Address: ${token_address} Token Counter: ${tokenCounter-1}`)
}

async function mintRentableNFT(token_address,ipfsHash,signer) {

    const RentToken = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXRent.sol/AVFXRent.json', 'utf-8'))

    console.log("Minting Rentable NFT...")

    const contract = new ethers.Contract(token_address, RentToken.abi, signer)

    const transaction = await contract.mint(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
    await transaction.wait()

    const tokenCounter = await contract.tokenCounter()

    return(`Contract Address: ${token_address} Token Counter: ${tokenCounter-1}`)
}



module.exports = {
    mintGeneralNFT,
    mintRentableNFT
};
