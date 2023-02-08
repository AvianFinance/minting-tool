const { ethers } = require("hardhat")
const fs = require('fs');
const { deploy_general,deploy_rental } = require('./deploy/deploy_contract')
const { mintGeneralNFT,mintRentableNFT } = require('./scripts/mint')
const { uploadToPinata } = require('./services/pinata_upload')

const prompt = require('prompt-sync')();

const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
const signer_m = new ethers.Wallet("7e0dd21cba3952c769b9a90376893a351d4ac356aeacd0e537f5022e08593528", provider); // Meelan Credentials

async function main(){

    while (true){

        console.log("Welcome to the minting tool")
    
        let inpt = prompt('What to do?');
    
        condition = Number(inpt);
    
        if (condition==1){ // select to create a collection
    
            console.log("creating a collection for you")
    
            let ipt = prompt('which type 1 or 2 ?');
    
            cond = Number(ipt);
    
            let name = prompt('Name of the collection?');
            let symbol = prompt('symbol of the collection?');
    
            if (cond == 1){
                const addr = await deploy_general(signer_m,String(name),String(symbol))
                console.log(addr)
            } else if (cond==2){
                const aadr = await deploy_rental(signer_m,String(name),String(symbol))
                console.log(addr)
            }
    
        }else if (condition==2){
    
            console.log("Minting nft")
    
            const token_address = "0xA2dC40759bEc2F8f889739f5ed5B1F4C4bE6a2fb"
    
            const img_name = "lion.jpg"
    
            const image = fs.readFileSync(`./${img_name}`);
    
            console.log("Image Uploading to Pinata...")
    
            const tokenCounter = await getTokenCounter("general",token_address)

            let nft_name = prompt('Name of the NFT?');
            let nft_desc = prompt('symbol of the NFT?');
    
            const ipfsHash = await uploadToPinata(image, img_name, tokenCounter, nft_name, nft_desc)
    
            console.log(await mintGeneralNFT(token_address,ipfsHash,signer_m))
    
        }else if (condition=3){
            break;
        }
    
    
    }

}





async function getTokenCounter(type,token_address) {

    const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")

    if (type=="general"){
        const Token = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXGeneral.sol/AVFXGeneral.json', 'utf-8'))
        const contract = new ethers.Contract(token_address, Token.abi, provider)
        const tokenCounter = await contract.tokenCounter()
        return tokenCounter
    } else if (type=="rentable"){
        const Token = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXRent.sol/AVFXRent.json', 'utf-8'))
        const contract = new ethers.Contract(token_address, Token.abi, provider)
        const tokenCounter = await contract.tokenCounter()
        return tokenCounter
    }


    

}

main()

