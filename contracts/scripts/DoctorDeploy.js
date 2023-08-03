const {ethers} = require("hardhat");

const main = async()=>{
    const Contract = await ethers.getContractFactory("Doctors");
    const deployContract = await Contract.deploy();
    await deployContract.waitForDeployment();

    console.log("Contract Address: ", await deployContract.getAddress());
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.log(error);
    process.exit(1);
});
