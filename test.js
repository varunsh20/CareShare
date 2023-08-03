import { ethers } from "ethers";
import { Patients } from "./contracts/artifacts/contracts/Patients.sol/Patients.json" assert { type: "json" };

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/nY-rLAKBOcsvbg4KlUINo5sEq_LG5Z0V");
    const contract = new ethers.Contract("0x6866E4A9BbB69521176e593C6B7dAE464AA74586", Patients.abi,provider);

    const getDeployed = contract.filters. PatientRegistered();
    let events = await contract.queryFilter(getDeployed);
    let event = events.reverse();
    console.log(event);

};

main();