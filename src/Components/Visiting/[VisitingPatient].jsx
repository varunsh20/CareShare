import { useParams } from "react-router-dom";
import VisitingPatientSideBar from "./VisitingPatientSideBar";
import { useState,useEffect} from "react";
import { ethers } from "ethers";
import "../Doctors/DoctorStyles.css";
import {TailSpin} from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';


export default function VisitingPatient(){

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const Doctor_Address = import.meta.env.VITE_D_ADDRESS
    const RPC_URL =  import.meta.env.VITE_RPC_URL;

    const {addr} = useParams();

    const [formInput, setFormInput] = useState({
        rating:"",
        review:"",
    });

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
    const [ratings,setRating] = useState([]);

    //Function to convert wei to ether.
    const toEtherfromWei = (num) => ethers.utils.formatEther(num)


    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const p_contract = new ethers.Contract(Patient_Address,Patients.abi,provider);
    const d_contract = new ethers.Contract(Doctor_Address,Doctors.abi,provider);
    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const write_contract = new ethers.Contract(Patient_Address,Patients.abi,providers.getSigner());

    useEffect(()=>{
        async function getDoctorInfo(){
            const info = await d_contract.viewDoctorInfo(addr);
            const data = await p_contract.viewDoctorRatings(addr);
            const Content = data.map((e) => {
                return {
                    rating: parseInt(e.rating),
                  feedback: e.feedback,
                  patientId: e.patientId
                }
              });
            setRating(Content);
            var year = new Date().getFullYear();
            const age = year -  info.dob.split('-')[0];  
            setAge(age);
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

    const addRating = async()=>{
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Metamask", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if(formInput.rating === "") {
            toast.warn("Please Provide A Rating", {
            position: toast.POSITION.TOP_CENTER
            });
        } 
        else if(formInput.review === "") {
            toast.warn("Please Provide A Review", {
            position: toast.POSITION.TOP_CENTER
            });
        } 
        else{
            const response = await write_contract.rateDoctor(addr,formInput.rating,formInput.review);
            await response.wait()
            .then( () => {
                toast.success("Rating Given Successfully.", {
                position: toast.POSITION.TOP_CENTER
                });
              }).catch( () => {
                toast.success("Some issue occured. Please Retry", {
                  position: toast.POSITION.TOP_CENTER
                });
              })
            window.location.reload(true);
        }
    }

    return(
        <>
        <VisitingPatientSideBar/>
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
                </div>
            <div className = "records">
                <div className = "problem">
                    <h2>Ratings and Reviews Given By Other Patients:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Rating</th>
                                <th>Reviews</th>
                                <th>Given By</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map((e) =>{
                                return(
                            <tr>
                                <td>{e.rating}</td>
                                <td>{e.feedback}</td>
                                <td>{e.patientId}</td>
                            </tr>
                            )
                            })
                        }
                            <tr>
                            <td><div className = "ip">
                                <input name="rating" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                rating: prop.target.value
                                })
                            } placeholder="Rating" required/></div></td>
                            <td><div className = "ip">
                                <input name="review" onChange={
                                (prop) => setFormInput({
                                ...formInput,
                                review: prop.target.value
                                })
                            } placeholder="Reviews" required/></div></td>
                            <td>
                           <br></br></td>  
                                <td>
                                <div className="nbtn">
                                <button onClick = {addRating}>Add New</button>
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