import {useState,useEffect} from "react";
import { ethers } from "ethers";
import {TailSpin} from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import { Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";
import {Link} from "react-router-dom";
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';
import "./availableStyles.css";

export default function Available(){

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const Doctor_Address = import.meta.env.VITE_D_ADDRESS
    const RPC_URL =  import.meta.env.VITE_RPC_URL;


    const [allDoc, setAllDoc] = useState();
    const [loading, setLoading] = useState(true);
    const [modal,setModal] = useState(false);
    const [address,setAddress] = useState("");
    const [fees, setFees] = useState("");

    const [formInput, setFormInput] = useState({
        date:"",
        time:"",
        type:""
    });

    //Function to convert wei to ether.
    const toEtherfromWei = (num) => ethers.utils.formatEther(num)

    useEffect(()=>{
        async function getAllDoctors(){
            const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
            const contract = new ethers.Contract(Doctor_Address,Doctors.abi,provider);
            const response = await contract.getDoctors();
            setAllDoc(response);
            setLoading(false)
        }
        getAllDoctors();
    },[])

    const handleStates = (address,fees)=>{
        setModal(true);
        setAddress(address);
        setFees(fees)
    }
    const makeAppointment = async()=>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(Patient_Address,Patients.abi,provider.getSigner());
        const accounts = await ethereum.request({method:'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Wallet.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if(formInput.date === "") {
            toast.warn("Appointment Date is not selected.", {
            position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.time === "" ) {
            toast.warn("Appointment Time is not selected.", {
                position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.type === "") {
            toast.warn("Appointment Type is not selected", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else{
            const response = await contract.makeAppointment(address,formInput.date,formInput.time,fees, formInput.type,{
                value: fees,});
            await response.wait()
            .then(() => {
                toast.success("Appointment Booked Successfully.", {
                position: toast.POSITION.TOP_CENTER
                });
                }).catch( () => {
                toast.success("Some Error Occured.", {
                    position: toast.POSITION.TOP_CENTER
                });
                })
            }
        setAddress("");
        setFees("");
    }
    return(
        <>
         <Modal
            size = 'lg'
            isOpen = {modal}
            toggle = {()=>setModal(!modal)}>
            <ModalHeader toggle = {()=>setModal(!modal)}>
                Book Appointment
                </ModalHeader>
                <ModalBody>
                    <form>
                    <Row>
                        <Col lg={12}>
                            <div className="enm">
                                <label htmlFor='Date'>
                                    Appointment Date
                                </label>
                                <input name="name" type = "date" className = "form-control"  min={moment().format("YYYY-MM-DD")} onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                date: prop.target.value
                                })
                                } required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="enm">
                                <label htmlFor='Time'>
                                    Appointment Time
                                </label>
                                <input name="time" type = "time" className = "form-control" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                time: prop.target.value
                                })
                                } placeholder="Time" required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "aType">
                                <label htmlFor='type'>
                                    Appointment Type
                                </label>
                                <div className = "options">
                                <label><input name="type" type = "radio" value = 'false' onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                type: prop.target.value
                                })
                                } required/> Offline</label>
                                <label><input name="type" type = "radio" value = 'true' onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                type: prop.target.value
                                })
                                } required/> Online</label>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    </form>
                    <div className="epbtn">
                    <button onClick = {makeAppointment}>Submit</button>
                    </div>
                    <ToastContainer/>
                </ModalBody>
            </Modal>
        <div className = "content">
            <div className = "intro">
                <h3>Discover a diverse selection of registered doctors on our portal and find the perfect fit for your medical needs. Take advantage of our user-friendly 
                    platform to browse through our network of esteemed healthcare providers and effortlessly book appointments that cater to your specific requirements.</h3>
            </div>
         {loading? <div className="spinner">
                <TailSpin height={150}></TailSpin>
                </div>:
                    <div className = "list">
                        {allDoc.length==0?(<div>No records found </div>):
                        <>
                        {allDoc.map((e)=>{
                        return(
                            <>
                        <div className = "docCards">
                        <div className = "dImage">
                            <img src = {e.url} alt="logo"></img>
                        </div>
                        <div className = "ddetails">
                        <div className = "dinfo">
                            <p><b>Name:   </b>{e.name}<br></br>
                            <b>Specialities:</b> {e.speciality}<br></br>
                            <b>Qualifications:</b> {e.qualifications}<br></br>
                            <b>Appointment Fees:</b> {toEtherfromWei(e.fees)} matic<br></br></p>
                        </div>
                        <div className = "visit">
                            <Link to = {`/doctor/${e.doctorAddress}`}>View Profile</Link>
                        </div>
                        <div className = "abtn">
                            <button onClick = {() =>handleStates(e.doctorAddress,e.fees)}>Book Apppointment</button>
                        </div>
                        </div>
                        </div>
                        </>
                        )}
                    )}
                    </>
                    }
                    </div>
        }
         </div>
        </>
    );
}