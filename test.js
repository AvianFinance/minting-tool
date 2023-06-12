const { ethers } = require("hardhat")
const fs = require('fs');
const { deploy_general,deploy_rental } = require('./deploy/deploy_contract')
const { mintGeneralNFT,mintRentableNFT } = require('./scripts/mint')
const { uploadToPinata } = require('./services/pinata_upload')
const FormData = require('form-data');
const { log } = require("console");

const prompt = require('prompt-sync')();

const avax_provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
const eth_provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/086ef2c6684246f5a5a39f241fd2aaed")
const signer_i_eth = new ethers.Wallet("986815db062b75efa84cd38ea93e08e9e13a42ee9493f756c1bc661d06201e68", eth_provider); // Meelan Credentials
const signer_r_eth = new ethers.Wallet("c961b4717700d5acc731a150fd0251e0b0a5a2d9eb100a570197efc06a4e93b5", eth_provider); // Meelan Credentials
const signer_r_avax = new ethers.Wallet("2f3b47319ba27e3e58ae7a62ecb3966b23b9df1b8a12d1b7520f643a6d7fdc33", avax_provider); // Meelan Credentials
const signer_i_avax = new ethers.Wallet("986815db062b75efa84cd38ea93e08e9e13a42ee9493f756c1bc661d06201e68", avax_provider);

async function main(){

    while (true){

        console.log("Welcome to the minting tool")
    
        let inpt = prompt('What to do you want to test? type 1 for test creating a collection and minting a nft, 2 for exit');
    
        condition = Number(inpt);
        
        if (condition==1){ // select to create a collection
            
            let inpt = prompt('What to do you want to test? type 1 for test creating a collection. 2 for minting a nft , 3 for exit');
    
            conditiontype = Number(inpt);

            if (conditiontype==1){
                let name = 'general collection';
                let symbol = 'gc';
                let index = 1;
                let start = Date.now();
                console.log("using avalanche network")
                console.log("creating a general collection for you ")
                
                const gen_addr = await deploy_general(getSignerfromindex(index),String(name),String(symbol))
                console.log('gen_addr', gen_addr)
                let timeTaken = Date.now() - start;
                console.log("finished creating a general collection for you(avalanche 721). timetaken is : ", timeTaken)
                console.log('')

                let start1 = Date.now();
                console.log("creating a rentable collection for you ")
                
                const rent_addr = await deploy_rental(getSignerfromindex(index),String(name),String(symbol))
                console.log('rent_addr',rent_addr)
                let timeTaken1 = Date.now() - start1;
                console.log("finished creating a rentable collection for you(avalanche 4907). timetaken is : ", timeTaken1)
                console.log('')

                index = 2;
                let start2 = Date.now();
                console.log("using ethereum network")
                console.log("creating a general collection for you ")
                
                const gen_addr1 = await deploy_general(getSignerfromindex(index),String(name),String(symbol))
                console.log('gen_addr', gen_addr1)
                let timeTaken2 = Date.now() - start2;
                console.log("finished creating a general collection for you(eth 721). timetaken is : ", timeTaken2)
                console.log('')

                let start3 = Date.now();
                console.log("creating a rentable collection for you ")
                
                const rent_addr1 = await deploy_rental(getSignerfromindex(index),String(name),String(symbol))
                console.log('rent_addr',rent_addr1)
                let timeTaken3 = Date.now() - start3;
                console.log("finished creating a general collection for you(eth 4907). timetaken is : ", timeTaken3)
            } else if (conditiontype==2){
                const img_name = "lion.jpg"
    
                const image = fs.readFileSync(`./${img_name}`);

                console.log(image)
        
                console.log("Image Uploading to Pinata...")
                
                token_address = '0x4909493F604AB882327ca880ad5B330e2B3C43C1'
                let rental_token_address = '0x341696b0ACCDC3E3843B834857421b0CF975a3c9'

                let nft_name = 'lion'
                let nft_desc = 'king of the jungle'

                const formData = new FormData()
                formData.append('file', image, img_name)
        
                // const ipfsHash = await uploadToPinata(formData, tokenCounter, nft_name, nft_desc)
                let ipfsHash = 'https://gateway.pinata.cloud/ipfs/QmQdf7EoQ737mkDPYHrs3qAY8vhNbZCL2ad98eGSRrvegB'

                console.log("using avalanche network")
                console.log("minting a 721 nft for you ")
                let start4 = Date.now();
                let add1 = await mintGeneralNFT('0x03de48ed6209b4d11d027b38ea7956f20e8df925',ipfsHash,signer_i_avax)
                console.log(add1)
                let timeTaken4 = Date.now() - start4;
                console.log("finished minting nft for you(avalanche 721). timetaken is : ", timeTaken4)

                console.log("minting a 4907 nft for you ")
                let start5 = Date.now();
                let add2 = await mintRentableNFT('0x0ec29f754eb94de12e7dd196fc220a97f2deefd8',ipfsHash,signer_i_avax)
                console.log(add2)
                let timeTaken5 = Date.now() - start5;
                console.log("finished minting nft for you(avalanche 4907). timetaken is : ", timeTaken5)

                console.log("using ethereum network")
                console.log("minting a 721 nft for you ")
                let start6 = Date.now();
                let add3 = await mintGeneralNFT('0x341696b0accdc3e3843b834857421b0cf975a3c9',ipfsHash,signer_i_eth)
                console.log(add3)
                let timeTaken6 = Date.now() - start6;
                console.log("finished minting nft for you(eth 721). timetaken is : ", timeTaken6)

                console.log("minting a 4907 nft for you ")
                let start7 = Date.now();
                let add4 = await mintRentableNFT('0xe8acd0db63262eb9bb905d6b9be9e3f4459bb907',ipfsHash,signer_i_eth)
                console.log(add4)
                let timeTaken7 = Date.now() - start7;
                console.log("finished minting nft for you(eth 721). timetaken is : ", timeTaken7)
            } else {
                break;
            }
        }else if (condition=3){
            break;
        }
    
    
    }

}

function getSignerfromindex(index){
    if (index==1){
        return signer_i_avax
    }
    else if (index==2){
        return signer_i_eth
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

