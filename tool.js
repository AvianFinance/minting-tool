const { ethers } = require("hardhat")
const fs = require('fs');
const { deploy_general,deploy_rental } = require('./deploy/deploy_contract')
const { mintGeneralNFT,mintRentableNFT } = require('./scripts/mint')
const { uploadToPinata } = require('./services/pinata_upload')
const FormData = require('form-data');

const prompt = require('prompt-sync')();

const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
const signer_m = new ethers.Wallet("7e0dd21cba3952c769b9a90376893a351d4ac356aeacd0e537f5022e08593528", provider); // Meelan Credentials
const signer_r = new ethers.Wallet("2f3b47319ba27e3e58ae7a62ecb3966b23b9df1b8a12d1b7520f643a6d7fdc33", provider); // Meelan Credentials
const signer_i = new ethers.Wallet("986815db062b75efa84cd38ea93e08e9e13a42ee9493f756c1bc661d06201e68", provider); // Meelan Credentials

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
            let index = prompt('signer to use');
    
            if (cond == 1){
                const addr = await deploy_general(getSignerfromindex(index),String(name),String(symbol))
                console.log(addr)
            } else if (cond==2){
                const addr = await deploy_rental(getSignerfromindex(index),String(name),String(symbol))
                console.log(addr)
            }
    
        }else if (condition==2){
    
            console.log("Minting nft")
    
            const token_address = "0xA2dC40759bEc2F8f889739f5ed5B1F4C4bE6a2fb"
    
            const img_name = "lion.jpg"
    
            const image = fs.readFileSync(`./${img_name}`);

            console.log(image)
    
            console.log("Image Uploading to Pinata...")
    
            const tokenCounter = await getTokenCounter("general",token_address)

            let nft_name = prompt('Name of the NFT?');
            let nft_desc = prompt('symbol of the NFT?');

            const formData = new FormData()
            formData.append('file', image, img_name)
    
            const ipfsHash = await uploadToPinata(formData, tokenCounter, nft_name, nft_desc)
    
            console.log(await mintGeneralNFT(token_address,ipfsHash,signer_m))
    
        }else if (condition=3){
            break;
        }
    
    
    }

}

function getSignerfromindex(index){
    if (index==1){
        return signer_m
    }
    else if (index==2){
        return signer_r
    }else if (index==3){
        return signer_i
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

