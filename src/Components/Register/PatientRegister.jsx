import { ethers } from "ethers";
import { useState } from "react";
import moment from 'moment';
import { useStorageUpload } from "@thirdweb-dev/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./PatientRegisterStyles.css"
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';

export default function PatientRegister(){

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    
    const [formInput, setFormInput] = useState({
        name:"",
        dob:"",
        url:null,
        email:"",
        phoneNumber:"",
        resAddress:"",
        gender:""
      });

    const { mutateAsync: upload } = useStorageUpload();
    
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
        const contract = new ethers.Contract(Patient_Address,Patients.abi,provider.getSigner());
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
        else if(formInput.resAddress === "") {
            toast.warn("Residential Address Is Empty", {
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
            const response = await contract.addPatient(formInput.name,formInput.dob,formInput.email,formInput.phoneNumber,formInput.url,formInput.resAddress,formInput.gender);
            await response.wait()
            .then( () => {
              toast.success("Patient Registered Successfully.", {
              position: toast.POSITION.TOP_CENTER
              });
            }).catch( () => {
              toast.success("Failed to register patient.", {
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
            <h2>Fill the Following Details To Register Yourself as a Patient on CareShare.</h2>
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
                <p>Residential Address</p>
            <input name="resAddress" onChange={
                (prop) => setFormInput({
                    ...formInput,
                    resAddress: prop.target.value
                })
                } placeholder="Residential Address" required/>
            </div>
            <div className = "dob-gender">
            <div className="dob-div">
                <p>Date of Birth</p>
            <input name="dob" type = "date"  max={moment().format("YYYY-MM-DD")} onChange={
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
                } required/> Male</label>
            <label><input name="gender" type = "radio" value = '1' onChange={
                (prop) => setFormInput({
                    ...formInput,
                    gender: prop.target.value
                })
                } required/> Female</label>
            <label><input name="gender" type = "radio" value = '2' onChange={
                (prop) => setFormInput({
                    ...formInput,
                    gender: prop.target.value
                })
                } required/> Other</label>
            </div>
            </div>
            </div>
        <div className="Upload">
        <div className="cover-div">
            <p>Profile Image</p>
            <div className="dotted-div">
              <div className="top">
                <input className="uploadCover" type="file" id="cover" onChange={picUpload}/>
              </div>
            </div>
          </div>
        </div>
          <button className="submit"  onClick = {submitDetails}>Register</button>
          </div>
    </div>
    <ToastContainer/>
    </div>
    )
}
