const { expect } = require("chai");
const {ethers} = require("hardhat");

//Function to convert ether to wei.
const fromEthertoWei = (num) => ethers.parseEther(num.toString())
//Function to convert wei to ether.
const toEtherfromWei = (num) => ethers.formatEther(num)

describe("Tests for Patients contract",()=>{
  let patients;
  let addr1, addr2, addr3;

  beforeEach(async()=>{
    patients = await ethers.getContractFactory("Patients");
    [addr1,addr2,addr3] = await ethers.getSigners();
    deployPatients = await patients.deploy();
    await deployPatients.waitForDeployment();
    await deployPatients.connect(addr1).addPatient("varun","20/12/2000","abc@gmail.com",484848,"wddxdxdsd","india",0);
    await deployPatients.makeAppointment(addr3, "20/09/2024","12:00",fromEthertoWei(0.1),false,{value:fromEthertoWei(0.1)});
  })

  describe("Tests related to patient registration",()=>{

    it("Checks whether a patient exists or not",async()=>{
      expect(false, await deployPatients.checkPatientExists(addr2)).to.equal(false);
    })

    it("Should check for newly registered patient and its details",async()=>{
      const patient = await deployPatients.viewPatientInfo(addr1);
      expect(patient.patientAddress).to.equal(await addr1.getAddress());
      expect(patient.name).to.equal("varun");
      expect(patient.dob).to.equal("20/12/2000");
      expect(patient.url).to.equal("wddxdxdsd");
      expect(patient.email).to.equal("abc@gmail.com");
      expect(patient.phoneNumber).to.equal(484848);
      expect(patient.gender).to.equal(0);
      expect(patient.resAddress).to.equal("india");
    })

    it("Should throw and error when an unauthorized user tries to access patient's info",async()=>{
      expect(deployPatients.connect(addr2).viewPatientInfo(addr1)).to.be.revertedWith("You don't have access to info.");
    })
  })

  describe("Tests for updating a patient's info",()=>{
    it("Should update patient's basic info",async()=>{
      await deployPatients.connect(addr1).updateInfo(addr1,"arun",99999,"def@gmail.com","oooo","delhi");
      const patient = await deployPatients.viewPatientInfo(addr1);
      expect(patient.name).to.equal("arun");
      expect(patient.url).to.equal("oooo");
      expect(patient.email).to.equal("def@gmail.com");
      expect(patient.phoneNumber).to.equal(99999);
      expect(patient.resAddress).to.equal("delhi");
    })
  })

  describe("Tests for viewing and updating patient's medical records", ()=>{
    it("Should update and return a patient's medical records",async()=>{
      await deployPatients.connect(addr1).updateMedicalRecords(addr1,0,"allergy");
      var records = await deployPatients.connect(addr1).viewMedicalRecords(addr1,0);
      expect(records[0]).to.equal("allergy");
    })
  })

  describe("Tests related for making and viewing patient's appointments",()=>{
    it("Should create an appointment",async()=>{
      //await deployPatients.makeAppointment(addr3, "20/09/2024","12:00",fromEthertoWei(0.1),false,true,{value:fromEthertoWei(0.1)});
      var appointment = await deployPatients.viewMyAppointments(addr1);
      expect(appointment[0].date).to.equal("20/09/2024");
    })

    it("Should update an appointment's details",async()=>{
      //await deployPatients.makeAppointment(addr3, "20/09/2024","12:00",fromEthertoWei(0.1),false,true,{value:fromEthertoWei(0.1)});
      await deployPatients.updateAppointmentDetails(addr1, 0, "21/09/2024","13:00");
      var appointment = await deployPatients.viewMyAppointments(addr1);
      expect(appointment[0].date).to.equal("21/09/2024");
      expect(appointment[0].time).to.equal("13:00");
    })
  })

  describe("Tests related to doctor's info",()=>{
    it("Should check the appointment of a doctor",async()=>{
      var appointment = await deployPatients.connect(addr3).viewDocAppointments();
      expect(appointment[0].date).to.equal("20/09/2024");
    })

    it("Should allow a patient to rate and view their doctor's ratings",async()=>{
      await deployPatients.rateDoctor(addr3,4,"good");
      var ratings = await deployPatients.viewDoctorRatings(addr3);
      expect(ratings[0].rating).to.equal(4);
    })
  })
})

