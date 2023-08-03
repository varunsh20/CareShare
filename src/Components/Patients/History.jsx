import SideBar from "./PateintsSideBar";
import { useEffect, useState } from "react";
import {TailSpin} from 'react-loader-spinner';
import { ethers } from "ethers";
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';
import {Link} from "react-router-dom";

export default function History(){

    const [details, setDetails] = useState([]);
    const [loading,setLoading] = useState(true);

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const Doctor_Address = import.meta.env.VITE_D_ADDRESS
    const RPC_URL =  import.meta.env.VITE_RPC_URL;
    
    const toEtherfromWei = (num) => ethers.utils.formatEther(num);

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const p_contract = new ethers.Contract(Patient_Address,Patients.abi,provider);
    const d_contract = new ethers.Contract(Doctor_Address,Doctors.abi,provider);

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
    },[details])

    async function getDoctorDetails(address){
        const info = await d_contract.viewDoctorInfo(address);
        return [info.name,info.speciality];
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
        <SideBar/>
        <div className = "Dprofile">
        {loading? <div className="spinner">
                    <TailSpin height={150}></TailSpin>
                    </div>:
                <div className = "myAppointments">
                    <div className = "headr">
                    <h2>My Past Appointments and Consultations:</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Appointment With</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Online/Offline</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.length==0?<tr>
                                <td>No Records Found</td>
                            </tr>:(<>
                            {details.map((e)=>{
                            return(
                                <>
                                {parseInt(e.treatment.state)==1?
                                    <tr>
                                    <td>{e.id+1}</td>
                                    <td> <Link className = "lin" to = {`/doctor/${e.docAddress}`}>{e.docDetails[0]} </Link> <br></br> {e.docDetails[1]}</td>
                                    <td>{e.date}</td>
                                    <td>{e.time}</td>
                                    <td>{e.online?"Online":"Offline"}</td>
                                    <td>
                                    <Link className = "lin"  to = "/patientConsulation"   state={{ data:e.treatment }} >View Consultation</Link>
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