// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Doctors {

    using Counters for Counters.Counter;
    Counters.Counter private _doctorIds;


    //Defining an event that is emitted when a new doctor is registered
    event DoctorRegistered(
        address indexed _address,
        string name
    );

    //Defining an event that is emitted when a doctor consults a patient
    event Consulted(
        address indexed docAddress,
        address patientAddress,
        uint256 state
    );

    //Doctor data structure
    struct Doctor{
        address doctorAddress;
        uint256 id;
        string name;
        string dob;
        string url;
        uint256 fees;
        string speciality;
        string email;
        string phoneNumber;
        string hosAddress;
        string qualifications;
        uint64 gender;
    }

    //Treatment data structure
    struct Treatment{
        uint256 id;
        string remarks;
        uint256 state;
        string name;
        string frequency;
        string day;
    }

    //array that stores all the doctors that are registered
    Doctor[] private registeredDoctors;
    //Different mappings for storing and fetching data
    mapping(address=>Doctor) private doctorInfo;
    mapping(address=>bool) private doctorPresent;
    mapping(address=>mapping(address=>Treatment[])) private treatments;

    //Function for checking the owner of doctor's records
    function onlyDoctorOwnerAccess(address _address) private view returns(bool){
        return (msg.sender == doctorInfo[_address].doctorAddress);
    }

    //This function checks whether a doctor exists in our records or not
    function checkDoctorExists(address _addr) public view returns(bool){
        require(_addr!=address(0),"Invalid address");
        return doctorPresent[_addr];
    }

    //Function to get list of all registered doctors
    function getDoctors() public view returns(Doctor[] memory){
        return registeredDoctors;
    }
    
     //Function to add a new doctor
    function addDoctor(string calldata _name, string memory _dob, string memory _url, uint256 _fees, string memory _speciality, 
    string memory _email, string memory _phone, string memory _hosAddress, string memory _qualifications, uint64 _gender) external{
        uint256 _id = _doctorIds.current();
        Doctor memory doctor = Doctor(msg.sender,_id,_name,_dob,_url, _fees,_speciality,_email,_phone,_hosAddress,_qualifications,_gender);
        doctorInfo[msg.sender] = doctor;
        doctorPresent[msg.sender] = true;
        registeredDoctors.push(doctor);
        _doctorIds.increment();
        emit DoctorRegistered(msg.sender, _name);
    }

     //Function to view a doctor's information
    function viewDoctorInfo(address _address) external view returns(Doctor memory){
        require(doctorPresent[_address],"No records found");
        return doctorInfo[_address];
    }

     //Below update function is used for updating doctor's basic info
    function updateDoctorInfo(address _address, string calldata _name, string memory _url, uint256 _fees, string memory _email,  string memory _hosAddress,  string memory _qualification
    , string memory _speciality,string memory _phone) external{
        require(onlyDoctorOwnerAccess(_address),"Access denied");
        doctorInfo[_address].name = _name;    
        doctorInfo[_address].url = _url;   
        doctorInfo[_address].fees = _fees;
        doctorInfo[_address].email = _email;     
        doctorInfo[_address].hosAddress = _hosAddress;
        doctorInfo[_address].qualifications = _qualification; 
        doctorInfo[_address].speciality = _speciality;  
        doctorInfo[_address].phoneNumber = _phone; 
        registeredDoctors[doctorInfo[_address].id] = doctorInfo[_address];

    }

    //Function for consulting a patient
    function consultPatient(address _address, uint256 _id, string calldata _name, string memory _frequency, string memory _days,string calldata _remarks, uint256 _state) external{
        require(checkDoctorExists(msg.sender),"Not allowed");
        Treatment memory treatment = Treatment(_id,_remarks, _state, _name,_frequency,_days);
        treatments[msg.sender][_address].push(treatment);
        emit Consulted(msg.sender, _address, _state);
    }

    //Function view treatments of a patient
    function viewTreatment(address _docAddress,address _patientAddress) external view returns(Treatment[] memory){
        return treatments[_docAddress][_patientAddress];
    }
}