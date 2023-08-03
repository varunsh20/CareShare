const {ethers} = require("hardhat");

const main = async()=>{
  const Contract = await ethers.getContractFactory("Patients");
  const deployedContract = await Contract.deploy();
  await deployedContract.waitForDeployment();
  console.log("Contract Address: ", await deployedContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });