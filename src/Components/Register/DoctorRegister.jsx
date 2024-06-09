import { useState} from "react";
import moment from 'moment';
import { ethers } from "ethers";
import { useStorageUpload } from "@thirdweb-dev/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./DoctorRegisterStyles.css"
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';

export default function DoctorRegister(){

    const Doctor_Address = import.meta.env.VITE_D_ADDRESS

    const [formInput, setFormInput] = useState({
        name:"",
        dob:"",
        url:null,
        email:"",
        phoneNumber:"",
        speciality:"",
        qualifications:"",
        hosAddress:"",
        gender:"",
        fees:""
      });

    const { mutateAsync: upload } = useStorageUpload();
    //Function to convert ether to wei.
    const fromEthertoWei = (num) => ethers.utils.parseEther(num.toString())
    
    const picUpload = async () => {
        const fileInput = document.getElementById('cover');
        const filePath = fileInput.files[0].name;
        const imageCID = await upload({ data: [fileInput.files[0]] });
        if(imageCID){
          toast.success("File Uploaded Successfully.", {
          position: toast.POSITION.TOP_CENTER
        });
      }
    
        setFormInput({
          ...formInput,
          url: `https://ipfs.io/ipfs/${imageCID.toString().split("://")[1]}`
        })
    }

    const submitDetails = async()=>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(Doctor_Address,Doctors.abi,provider.getSigner());
        const accounts = await ethereum.request({method:'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Wallet", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if(formInput.name === "") {
            toast.warn("Name Field Is Empty", {
            position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.dob === "" ) {
            toast.warn("Date of birth is Not Selected", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.email === "") {
            toast.warn("Email Is Empty", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.phoneNumber === "") {
            toast.warn("Phone Number Is Empty", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.fees === "") {
            toast.warn("Please Specify Your Appointment Fees", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.qualifications === "") {
            toast.warn("Please Provide Your Qualifications", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.speciality === "") {
            toast.warn("Please Provide Your Speciality", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.hosAddress === "") {
            toast.warn("Clinic/Hospital Address Is Empty", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.gender === "") {
            toast.warn("Gender Is Not Selected", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.url === null) {
            toast.warn("Please Upload Your Image", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else{
            const response = await contract.addDoctor(formInput.name,formInput.dob,formInput.url,fromEthertoWei(formInput.fees),formInput.speciality,formInput.email,formInput.phoneNumber,formInput.hosAddress,formInput.qualifications,formInput.gender);
            await response.wait()
            .then( () => {
              toast.success("Doctor Registered Successfully.", {
              position: toast.POSITION.TOP_CENTER
              });
            }).catch( () => {
              toast.error("Failed to register doctor.", {
                position: toast.POSITION.TOP_CENTER
              });
            })
            window.location.reload(true);
        }
    }

    return(
        <div className="cntain">
        <div className="main">
          <div className="hd">
            <h2>Fill the Following Details To Register Yourself as a Doctor on CareShare.</h2>
        </div>
            <div className="publishform">
            <div className="name-div">
                <p>Name</p>
            <input name="name" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    name: prop.target.value
                })
                } placeholder="Name" required/>
            </div>
            <div className="name-div">
                <p>Email</p>
            <input name="email" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    email: prop.target.value
                })
                } placeholder="Email" required/>
            </div>
            <div className="name-div">
                <p>Phone Number</p>
            <input name="phone" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    phoneNumber: prop.target.value
                })
                } placeholder="Phone" required/>
            </div>
            <div className="name-div">
                <p>Clinic/Hospital Address</p>
            <input name="resAddress" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    hosAddress: prop.target.value
                })
                } placeholder="Residential Address" required/>
            </div>
            <div className="name-div">
                <p>Qualifications</p>
            <input name="qualifications" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    qualifications: prop.target.value
                })
                } placeholder="(Ex - MBBS, MS)" required/>
            </div>
            <div className="name-div">
                <p>Specialities</p>
            <input name="phone" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    speciality: prop.target.value
                })
                } placeholder="(Ex -  Pediatrician, Dermatologist)" required/>
            </div>
            <div className="name-div">
                <p>Appointment Fees</p>
            <input name="phone" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    fees: prop.target.value
                })
                } placeholder="(1)" required/>
            </div>
            <div className = "dob-gender">
            <div className="dob-div">
                <p>Date of Birth</p>
            <input name="dob" type = "date" max={moment().format("YYYY-MM-DD")} onChange={
                (prop) => setFormInput({
                    ...formInput,
                    dob: prop.target.value
                })
                }  required/>
            </div>
            <div className="gender-div">
            <p>Gender</p>
            <div className = "genderType">
            <label><input name="gender" type = "radio" value = '0' onChange={
                (prop) => setFormInput({
                    ...formInput,
                    gender: prop.target.value
                })
                } required/>Male</label>
            <label><input name="gender" type = "radio" value = '1' onChange={
                (prop) => setFormInput({
                    ...formInput,
                    gender: prop.target.value
                })
                } required/>Female</label>
            <label><input name="gender" type = "radio" value = '2' onChange={
                (prop) => setFormInput({
                    ...formInput,
                    gender: prop.target.value
                })
                } required/>Other</label>
            </div>
            </div>
            </div>
        <div className="Upload">
        <div className="cover-div">
            <p>Profile Image</p>
            <div className="dotted-div">
              <div className="top">
                <input className="uploadCover" type="file" id="cover" onChange = {picUpload}/>
              </div>
            </div>
          </div>
        </div>
        
          <button className = "submit"  onClick = {submitDetails}>Register</button>
        </div>
    </div>
    <ToastContainer/>
    </div>
    );
}
