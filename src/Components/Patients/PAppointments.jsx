import SideBar from "./PateintsSideBar";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import {TailSpin} from 'react-loader-spinner';
import { ethers } from "ethers";
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';
import moment from 'moment';
import "./pAppointmentStyles.css";
import {Link} from "react-router-dom";
import { Modal,ModalHeader,ModalBody,Row,Col} from "reactstrap";


export default function PAppointments(){

    const [formInput,setFormInput] = useState({
        up_date:"",
        time:""
    })

    const [details, setDetails] = useState([]);
    const [loading,setLoading] = useState(true);
    const [modal,setModal] = useState(false);
    const [GivenDate,setDate] = useState("");
    const [Time,setTime] = useState("");
    const [id,setId] = useState("");

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const Doctor_Address = import.meta.env.VITE_D_ADDRESS
    const RPC_URL =  import.meta.env.VITE_RPC_URL;


    const toEtherfromWei = (num) => ethers.utils.formatEther(num);

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const p_contract = new ethers.Contract(Patient_Address,Patients.abi,provider);
    const d_contract = new ethers.Contract(Doctor_Address,Doctors.abi,provider);
    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const write_contract = new ethers.Contract(Patient_Address,Patients.abi,providers.getSigner());

    useEffect(()=>{
        async function getAppointments(){
            const accounts = await ethereum.request({method: 'eth_accounts'});
            const appointmentsData = await p_contract.viewMyAppointments(accounts[0]);
            const Content = await Promise.all(appointmentsData.map(async (e) => {
                return {
                    id:parseInt(e.id),
                    fees:toEtherfromWei(e.fee),
                    docAddress:e.docAddress,
                    docDetails:await getDoctorDetails(e.docAddress),
                    patientAddress:e.patientAddress,
                    treatment:await checkTreatment(parseInt(e.id),e.docAddress),
                    online:e.online,
                    date:e.date,
                    time:e.time
                }
              }));
            setDetails(Content);
            setLoading(false);
            
        }
        getAppointments();
    })

    useEffect(() => {
      }, [details]); 


    async function getDoctorDetails(address){
        const info = await d_contract.viewDoctorInfo(address);
        return [info.name,info.speciality];
    }

    const handleStates = (date,time,id)=>{
        setModal(true);
        setDate(date);
        setTime(time)
        setId(id);
    }

    const editAppointment = async()=>{
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Metamask", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        if(formInput.up_date==""){
            formInput.up_date = GivenDate;
        }
        if(formInput.time==""){
            formInput.time = Time;
        }
        else{
        const response = await write_contract.updateAppointmentDetails(accounts[0],id,formInput.up_date,formInput.time);
        await response.wait()
        .then(() => {
            toast.success("Appointment Updated Successfully.", {
            position: toast.POSITION.TOP_CENTER
            });
            }).catch( () => {
            toast.success("Some error occured.", {
                position: toast.POSITION.TOP_CENTER
            });
            })
            window.location.reload(true);
        }
        setDate("");
        setTime("");
        setId("");
       
    }

    async function checkTreatment(a_id,d_addr){
        const accounts = await ethereum.request({method: 'eth_accounts'});
        const p_treatments = await d_contract.viewTreatment(d_addr,accounts[0]);
        var st = {};
        p_treatments.map((treatment)=>{
            if(a_id==parseInt(treatment.id).toString()){
                st = treatment;
            }
        })
        return st;
    }

    return(
        <>
         <Modal
            size = 'lg'
            isOpen = {modal}
            toggle = {()=>setModal(!modal)}>
            <ModalHeader toggle = {()=>setModal(!modal)}>
                Update Appointment
                </ModalHeader>
                <ModalBody>
                    <form>
                    <Row>
                        <Col lg={12}>
                            <div className = "enm">
                                <label htmlFor='Date'>
                                    Appointment Date
                                </label>
                                <input name="name" type = "date" className = "form-control"  min={moment().format("YYYY-MM-DD")} onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                up_date: prop.target.value
                                })
                                } required/>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className = "enm">
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
                    </Row>
                    </form>
                    <div className = "epbtn">
                    <button onClick = {editAppointment}>Submit</button>
                    </div>
                    <ToastContainer/>
                </ModalBody>
            </Modal>
        <SideBar/>
        <div className = "Dprofile">
        {loading? <div className="spinner">
                    <TailSpin height={150}></TailSpin>
                    </div>:
                <div className = "myAppointments">
                    <div className = "headr">
                    <h2>My Scheduled Appointments:</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Appointment With</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Online/Offline</th>
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                        {details.length==0?<tr>
                                <td>No Records Found</td>
                            </tr>:(<>
                                {details.map((e)=>{
                                return(
                                <>
                                {e.treatment.state==null?
                                    <tr>
                                    <td>{e.id+1}</td>
                                    <td> <Link className = "lin" to = {`/doctor/${e.docAddress}`}>{e.docDetails[0]} </Link> <br></br> {e.docDetails[1]}</td>
                                    <td>{e.date}</td>
                                    <td>{e.time}</td>
                                    <td>{e.online?"Online":"Offline"}</td>
                                    <td>
                                    <div className = "nbtn">
                                    <button onClick = {() =>handleStates(e.date,e.time,e.id.toString())}>Update Details</button>
                                    </div>
                                    </td>
                                    </tr>:<></>
                                }
                                </>
                                )}
                                )}</>
                            )}
                        </tbody>
                    </table>
                </div>
        }  
        </div> 
        </>
    );
}