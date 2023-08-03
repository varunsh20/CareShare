import SideBar from "./DoctorsSideBar";
import { useState,useEffect} from "react";
import { Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import "./DoctorStyles.css";
import { ethers } from "ethers";
import { Web3Storage} from 'web3.storage/dist/bundle.esm.min.js';
import {TailSpin} from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';

export default function Doctor(){

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const Doctor_Address = import.meta.env.VITE_D_ADDRESS
    const RPC_URL =  import.meta.env.VITE_RPC_URL;
    const token = import.meta.env.VITE_IPFS_TOKEN;

    const [formInput, setFormInput] = useState({
        name:"",
        url:null,
        fees:"",
        email:"",
        phone:"",
        speciality:"",
        qualifications:"",
        hosAddress:"",
      });

    const [id,setId] = useState("");
    const [age,setAge] = useState("");
    const [name,setName] = useState("");
    const [gender,setGender] = useState("");
    const [hosAddress,setAddress] = useState("");
    const [email,setEmail] = useState("");
    const [url,setUrl] = useState("");
    const [phone,setPhone] = useState("");
    const [fees,setFees] = useState("");
    const [qualifications,setQualifications] = useState("");
    const [speciality,setSpeciality] = useState("");
    const [loading,setLoading] = useState(true);
    const [ratings,setRating] = useState();
    const [modal,setModal] = useState(false);

    //Function to convert ether to wei.
    const fromEthertoWei = (num) => ethers.utils.parseEther(num.toString())
    //Function to convert wei to ether.
    const toEtherfromWei = (num) => ethers.utils.formatEther(num);

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(Doctor_Address, Doctors.abi,provider);
    const pContract = new ethers.Contract(Patient_Address, Patients.abi,provider);

    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const write_contract = new ethers.Contract(Doctor_Address,Doctors.abi,providers.getSigner());


    useEffect(()=>{
        async function getDoctorInfo(){
            const accounts = await ethereum.request({method: 'eth_accounts'});   
            const info = await contract.viewDoctorInfo(accounts[0]);
            const data = await pContract.viewDoctorRatings(accounts[0]);
            const Content = data.map((e) => {
                return {
                    rating: parseInt(e.rating),
                  feedback: e.feedback,
                  patientAddress:e.patientId
                }
              });
            setRating(Content);
            var year = new Date().getFullYear();
            const age = year -  info.dob.split('-')[0];  
            setAge(age);
            setId(info.id);
            setName(info.name);
            setFees(toEtherfromWei(info.fees));
            setName(info.name);
            setAddress(info.hosAddress);
            setPhone(info.phoneNumber);
            setEmail(info.email);
            setUrl(info.url);
            setGender((info.gender).toString());
            setQualifications(info.qualifications);
            setSpeciality(info.speciality);
            setLoading(false);
        }
        getDoctorInfo();
    },[])

        //It returns our access token.
         function getAccessToken () {
            return token;
        }
        //This function create a new web3storage client.
        function makeStorageClient () {
            return new Web3Storage({ token: getAccessToken() })
        }
        
        //This function uploads the cover image to ipfs and updates the state of cover image field with its uri.
        const coverHandle = async () => {
            const fileInput = document.getElementById('cover');
            const filePath = fileInput.files[0].name;
            const imageCID = await uploadToIPFS(fileInput.files,0);
        
            setFormInput({
              ...formInput,
              url: `http://lens.infura-ipfs.io/ipfs/${imageCID}/${filePath}`
            })
        }
    
        const uploadToIPFS = async (files, flag) => {
            const client = makeStorageClient()
            const cid = await client.put(files)
      
            // Fires toast when cover image or content is uploaded to ipfs.
            if(flag==0){
              toast.success("File Uploaded Successfully.", {
                position: toast.POSITION.TOP_CENTER
              });
            }
            return cid
        }

    const editProfile = async()=>{
        const accounts = await ethereum.request({method:'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Wallet", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        if(formInput.name==""){
            formInput.name = name;
        }
        if(formInput.email==""){
            formInput.email = email;
        }
        if(formInput.url==null){
            formInput.url = url;
        }
        if(formInput.phone==""){
            formInput.phone = phone;
        }
        if(formInput.fees==""){
            formInput.fees = fees;
        }
        if(formInput.hosAddress==""){
            formInput.hosAddress = hosAddress;
        }
        if(formInput.qualifications==""){
            formInput.qualifications = qualifications;
        }
        if(formInput.speciality==""){
            formInput.speciality = speciality;
        }
        else{
            const response = await write_contract.updateDoctorInfo(accounts[0], formInput.name,formInput.url, fromEthertoWei(formInput.fees),formInput.email,formInput.hosAddress,formInput.qualifications, formInput.speciality,formInput.phone);
            await response.wait()
            .then( () => {
                toast.success("Profile Updated Successfully.", {
                position: toast.POSITION.TOP_CENTER
                });
              }).catch( () => {
                toast.success("Some error occured.", {
                  position: toast.POSITION.TOP_CENTER
                });
            })
            window.location.reload(true);
        }
    }

    return(
        <>
        <Modal
            size = 'lg'
            isOpen = {modal}
            toggle = {()=>setModal(!modal)}>
            <ModalHeader toggle = {()=>setModal(!modal)}>
                Update Info
                </ModalHeader>
                <ModalBody>
                    <form>
                    <Row>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='Name'>
                                    Name
                                </label>
                                <input name="name" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                name: prop.target.value
                                })
                                } placeholder="Name" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='Email'>
                                    Email
                                </label>
                                <input name="email" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                email: prop.target.value
                                })
                                } placeholder="Email" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='Address'>
                                    Hospital Address
                                </label>
                                <input name="address" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                hosAddress: prop.target.value
                                })
                                } placeholder="Add New Address" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='qual'>
                                    Qualifications
                                </label>
                                <input name="qual" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                qualifications: prop.target.value
                                })
                                } placeholder="Add New Qualifications" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='speciality'>
                                    Specialities
                                </label>
                                <input name="speciality" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                speciality: prop.target.value
                                })
                                } placeholder="Add New Speciality" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='phone'>
                                    Phone Number
                                </label>
                                <input name="phone" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                phone: prop.target.value
                                })
                                } placeholder="Add New Phone" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='fees'>
                                    Appointment Fees
                                </label>
                                <input name="fees" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                fees: prop.target.value
                                })
                                } placeholder="Update Appointment Fees" required/>
                            </div>
                        </Col>
                        <div className="Upload">
                    <div className="ecover-div">
                        <p>Change Profile Image</p>
                        <div className="dotted-div">
                        <div className="top">
                            <input className="uploadCover" type="file" id="cover" onChange = {coverHandle}/>
                        </div>
                        </div>
                    </div>
                    </div>
                    </Row>
                    </form>
                    <div className = "epbtn">
                    <button onClick = {editProfile}>Submit</button>
                    </div>
                </ModalBody>

        </Modal>
        <SideBar/>
        <div className = "Dprofile">
        {loading? <div className="spinner">
                <TailSpin height={150}></TailSpin>
                </div>:
            <div>
            <div className = "Dinfo">
                <div className = "Dimage">
                    <img src = {url} alt="logo"></img>
                </div>
                <div className = "Ddetails">
                    <div className = "DnameAge">
                        <p><b>Name and Age:</b>  {name}, {age}<br></br>
                        <b>Gender:</b>  {gender=="0"?"Male":(gender=="1"?"Female":"Other")}<br></br>
                        <b>Hospital Address:</b>  {hosAddress}<br></br>
                        <i class="fa-solid fa-envelope"></i>  {email}<br></br>
                        <i class="fa-solid fa-phone"></i>  {phone}</p>
                    </div>
                    <div className = "qualifications">
                        <p><b>Speciality:</b>  {speciality}<br></br>
                        <b>Qualifications:</b>  {qualifications}<br></br>
                        <b>Appointment Fees:</b>  {fees} matic<br></br></p>
                    </div>
                </div>
                <div className="debtn">
                            <button onClick = {()=>setModal(true)}>Edit Profile</button>
                        </div>
            </div>
        <div className = "records">
            <div className = "problem">
                <h2>Ratings and reviews given by other patients:.</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Rating</th>
                            <th>Reviews</th>
                            <th>Given By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.length!="0"?(
                            <>
                        {ratings.map((e) =>{
                            return(
                        <tr>
                            <td>{e.rating}</td>
                            <td>{e.feedback}</td>
                            <td>{e.patientAddress}</td>
                        </tr>
                        )
                        })
                    }</>):
                    <tr>
                    <td>No ratings received yet</td>
                    </tr>
                    }      
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        }
        </div>
        <ToastContainer/>
        </>
    );
}