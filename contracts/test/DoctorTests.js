const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Tests for Doctors Contract",()=>{
    let Doctor;
    let addr1, addr2;

    beforeEach(async()=>{
        Doctor = await ethers.getContractFactory("Doctors");
        [addr1,addr2] = await ethers.getSigners();
        deployDoctors = await Doctor.deploy();
        deployDoctors.waitForDeployment();
        await deployDoctors.addDoctor("varun","20/12/2000","oooo",1,"dentist","abc@gmail.com","1243","india","mbbs",0)
    })

    describe("Tests related to doctor registration",()=>{

        it("Check whether a doctor exisst",async()=>{
            expect(true, await deployDoctors.checkDoctorExists(addr1)).to.equal(true);
        })
        it("Should check for newly registered doctor and its details",async()=>{
            var doctor  = await deployDoctors.viewDoctorInfo(addr1);
            expect(doctor.name).to.equal("varun");
        })
    })

    describe("Tests for updating a doctor's basic info",()=>{
        it("Should update a doctor's basic info",async()=>{
            await deployDoctors.updateDoctorInfo(addr1,"arun","mmmm",1,"def@","delhi","ms","surgeon","8888");
            var doctor  = await deployDoctors.viewDoctorInfo(addr1);
            expect(doctor.doctorAddress).to.equal(await addr1.getAddress());
            expect(doctor.name).to.equal("arun");
            expect(doctor.url).to.equal("mmmm");
            expect(doctor.fees).to.equal(1);
            expect(doctor.email).to.equal("def@");
            expect(doctor.hosAddress).to.equal("delhi");
            expect(doctor.qualifications).to.equal("ms");
            expect(doctor.speciality).to.equal("surgeon");
            expect(doctor.phoneNumber).to.equal("8888");
        })
    })

    describe("Tests related to consulting a patient",()=>{
        it("Should be able to consult a patient",async()=>{
            await deployDoctors.consultPatient(addr2,1,"dolo",3,2,"fever",1);
            const response = await deployDoctors.viewTreatment(addr1,addr2);
            expect(response[0].name).to.equal("dolo");
        })
    })
})
