import SideBar from "./PateintsSideBar";
import { useEffect, useState } from "react";
import { Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import "./PatientStyles.css";
import { useStorageUpload } from "@thirdweb-dev/react";
import { toast, ToastContainer } from 'react-toastify';
import {TailSpin} from 'react-loader-spinner';
import { ethers } from "ethers";
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';

export default function Patient(){

    const [formInput, setFormInput] = useState({
        issue:"",
        id:"",
        operation:"",
        id2:""
    });

    const [detailsFormInput, setDetailsFormInput] = useState({
        name:"",
        url:null,
        email:"",
        phone:"",
        resAddress:"",
      });

    const [issue,setIssue] = useState();
    const [surgery,setSurgery] = useState();
    const [id,setId] = useState("");
    const [age,setAge] = useState("");
    const [name,setName] = useState("");
    const [gender,setGender] = useState("");
    const [resAddress,setAddress] = useState("");
    const [email,setEmail] = useState("");
    const [url,setUrl] = useState("");
    const [phone,setPhone] = useState("");
    const [loading,setLoading] = useState(true);
    const [modal,setModal] = useState(false);

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const RPC_URL =  import.meta.env.VITE_RPC_URL;
    const token = import.meta.env.VITE_IPFS_TOKEN;

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const read_contract = new ethers.Contract(Patient_Address, Patients.abi,provider);
    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const write_contract = new ethers.Contract(Patient_Address,Patients.abi,providers.getSigner());


    useEffect(()=>{
        async function getPatientInfo(){
            const accounts = await ethereum.request({method: 'eth_accounts'});   
            const info = await read_contract.viewPatientInfo(accounts[0]);
            const healthRecords = await read_contract.viewMedicalRecords(accounts[0],0);
            const surgeryRecords = await read_contract.viewMedicalRecords(accounts[0],1);
            setIssue(healthRecords);
            setSurgery(surgeryRecords);
            var year = new Date().getFullYear();
            const age = year -  info.dob.split('-')[0];  
            setAge(age);
            setId(info.id);
            setName(info.name);
            setAddress(info.resAddress);
            setUrl(info.url);
            setPhone(info.phoneNumber.toString());
            setEmail(info.email);
            setGender((info.gender).toString());
            setLoading(false);
        }
        getPatientInfo();
    },[])

    const { mutateAsync: upload } = useStorageUpload();
    
    //This function uploads the cover image to ipfs and updates the state of cover image field with its uri.
    const picUpload = async () => {
        const fileInput = document.getElementById('cover');
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


    const editProfile = async()=>{
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Metamask", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        if(detailsFormInput.name==""){
            detailsFormInput.name = name;
        }
        if(detailsFormInput.email==""){
            detailsFormInput.email = email;
        }
        if(detailsFormInput.url==null){
            detailsFormInput.url = url;
        }
        if(detailsFormInput.phone==""){
            detailsFormInput.phone = phone;
        }
        if(detailsFormInput.resAddress==""){
            detailsFormInput.resAddress = resAddress;
        }
        else{
            console.log(accounts[0], detailsFormInput.name, detailsFormInput.phone, detailsFormInput.email, detailsFormInput.url, detailsFormInput.resAddress);
            const response = await write_contract.updateInfo(accounts[0], detailsFormInput.name, detailsFormInput.phone, detailsFormInput.email, detailsFormInput.url, detailsFormInput.resAddress);
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

    const addIssue = async()=>{
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Metamask", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        if(formInput.issue === "") {
            toast.warn("Please add an issue", {
            position: toast.POSITION.TOP_CENTER
            });
        } 
        else{
            const response = await write_contract.updateMedicalRecords(accounts[0],0,formInput.issue);
            await response.wait()
            .then( () => {
                toast.success("Issue Added Successfully.", {
                position: toast.POSITION.TOP_CENTER
                });
              }).catch( () => {
                toast.success("Failed to add issue.", {
                  position: toast.POSITION.TOP_CENTER
                });
              })
            window.location.reload(true);
        }
    }

    const addNew = async()=>{
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Metamask", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        if(formInput.operation === "") {
            toast.warn("Please add an issue", {
            position: toast.POSITION.TOP_CENTER
            });
        } 
        else{
            const response = await write_contract.updateMedicalRecords(accounts[0],1,formInput.operation);
            await response.wait()
            .then( () => {
                toast.success("Record Update Successfully.", {
                position: toast.POSITION.TOP_CENTER
                });
              }).catch( () => {
                toast.success("Failed to add record.", {
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
                                (prop) => setDetailsFormInput({
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
                                (prop) => setDetailsFormInput({
                                ...formInput,
                                email: prop.target.value
                                })
                                } placeholder="Email" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='Address'>
                                    Residential Address
                                </label>
                                <input name="address" className = "form-control" onChange={
                                (prop) => setDetailsFormInput({
                                ...formInput,
                                resAddress: prop.target.value
                                })
                                } placeholder="Add New Address" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='phone'>
                                    Phone Number
                                </label>
                                <input name="phone" className = "form-control" onChange={
                                (prop) => setDetailsFormInput({
                                ...formInput,
                                phone: prop.target.value
                                })
                                } placeholder="Add New Phone" required/>
                            </div>
                        </Col>
                        <div className="Upload">
                    <div className="ecover-div">
                        <p>Change Profile Image</p>
                        <div className="dotted-div">
                        <div className="top">
                            <input className="uploadCover" type="file" id="cover" onChange = {picUpload}/>
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
                <ToastContainer/>
            </Modal>
        <SideBar/>
        <div className = "Pprofile">
        {loading? <div className="spinner">
                <TailSpin height={150}></TailSpin>
                </div>:
                <div>
                <div className = "info">
                    <div className = "image">
                        <img src = {url} alt="logo"></img>
                    </div>
                    <div className = "details">
                        <div className = "nameAge">
                        <p><b>Name and Age:</b>  {name}, {age}<br></br>
                            <b>Gender:</b>  {gender=="0"?"Male":(gender=="1"?"Female":"Other")}<br></br>
                            <b>Residential Address:</b> {resAddress}<br></br>
                            <i class="fa-solid fa-envelope"></i>  {email}<br></br>
                            <i class="fa-solid fa-phone"></i>  {phone}</p>
                        </div>
                    </div>    
                    <div className = "ebtn">
                            <button onClick = {()=>setModal(true)}>Edit Profile</button>
                        </div>
                </div>
             
            <div className = "records">
            <div className = "problem">
                <h2>Health Issues:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Issue</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {issue.map((e,index) =>{
                            return(
                        <tr>
                            <td>{index+1}</td>
                            <td>{e}</td>
                        </tr>
                        )
                        })
                    }
                    <tr>
                        <td>
                        <div className = "ip">
                            <input name="id" onChange={
                            (prop) => setFormInput({
                            ...formInput,
                            id: prop.target.value
                            })
                        } placeholder="Id" required/></div></td>
                        
                            <td><div className = "ip">
                                <input name="issue" onChange={
                            (prop) => setFormInput({
                            ...formInput,
                            issue: prop.target.value
                            })
                        } placeholder="Issue" required/></div></td>
                            <td>
                            <div className="nbtn">
                                <button onClick = {addIssue}>Add Issue</button>
                            </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className = "operation">
                <h2>Fractures/Operations/Surgeries:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Issue</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {surgery.map((e,index) =>{
                            return(
                        <tr>
                            <td>{index+1}</td>
                            <td>{e}</td>
                        </tr>
                        )
                        })
                    }
                        <tr>
                        <td>
                        <div className = "ip">
                            <input name="id2" onChange={
                            (prop) => setFormInput({
                            ...formInput,
                            id2: prop.target.value
                            })
                        } placeholder="Id" required/></div></td>
                        
                            <td><div className = "ip">
                                <input name="operation" onChange={
                            (prop) => setFormInput({
                            ...formInput,
                            operation: prop.target.value
                            })
                        } placeholder="Operation" required/></div></td>
                            <td>
                            <div className="nbtn">
                                <button onClick = {addNew}>Add New</button>
                            </div>
                            </td> 
                        </tr>
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
