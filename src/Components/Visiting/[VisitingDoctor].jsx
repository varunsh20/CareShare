import VisitingDoctorSideBar from "./VisitingDoctorSideBar";
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
import {TailSpin} from 'react-loader-spinner';
import { ethers } from "ethers";
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';
import { useParams } from "react-router-dom";

export default function VisitingDoctor(){

    const {addr} = useParams();

    const [formInput, setFormInput] = useState({
        issue:"",
        id:"",
        operation:"",
        id2:""
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

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const RPC_URL =  import.meta.env.VITE_RPC_URL;

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const read_contract = new ethers.Contract(Patient_Address, Patients.abi,provider);
    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const write_contract = new ethers.Contract(Patient_Address,Patients.abi,providers.getSigner());

    useEffect(()=>{
        async function getPatientInfo(){
            const info = await read_contract.viewPatientInfo(addr);
            const healthRecords = await read_contract.viewMedicalRecords(addr,0);
            const surgeryRecords = await read_contract.viewMedicalRecords(addr,1);
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
        <VisitingDoctorSideBar data  = {addr}/>
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
                            <button onClick = {addIssue}>Add Issue</button>
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
                            <button onClick = {addNew}>Add New</button>
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