import SideBar from "./DoctorsSideBar";
import { toast, ToastContainer } from 'react-toastify';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';
import "./ConsultStyles.css";
import {Link} from "react-router-dom";

export default function Consult(){
    const info = useParams();

    const [formInput,setFormInput] = useState({
        remarks:"",
    });

    const [medicineInput,setMedicineInput] = useState({
        name:"",
        frequency:"",
        days:"",
    });

    const Doctor_Address = import.meta.env.VITE_D_ADDRESS
    
    const [addedRows, setAddedRows] = useState([]);
    const [Gname,setName] = useState([]);
    const [Gfrequency,setFrequency] = useState([]);
    const [Gdays,setDays] = useState([]);

    const handleMedicineChange = (e) => {
        setMedicineInput({
          ...medicineInput,
          [e.target.name]: e.target.value,
        });
      };
  
    const handleAddToList = () => {
      const { name, frequency, days } = medicineInput;
      if (name.length === 0 || frequency.length === 0 || days.length === 0) {
        toast.error("Please Fill All The Fields", {
            position: toast.POSITION.TOP_CENTER
        });
      }
      else{
        setAddedRows([...addedRows, { name, frequency, days }]);
        setName([...Gname,name]);
        setFrequency([...Gfrequency,frequency]);
        setDays([...Gdays,days]);
        setMedicineInput({
            name: "",
            frequency: "",
            days: "",
      });
    
    };
    }

    const handleAddNewRow = () => {
      handleAddToList(); 
    };
  
    const handleDeleteRow = (index) => {
      const updatedRows = [...addedRows];
      updatedRows.splice(index, 1);
      setAddedRows(updatedRows);
    };


    async function consultPatient(){
        const accounts = await ethereum.request({method:'eth_accounts'});
        if(accounts.length==0){
            toast.error("Please Connect Your Wallet", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        const { name, frequency, days } = medicineInput;
        if (addedRows.length==0)  {
          toast.error("Please Fill All The Fields", {
              position: toast.POSITION.TOP_CENTER
          });
        }
        if(formInput.remarks==""){
            formInput.remarks = "none";
        }
        else{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(Doctor_Address,Doctors.abi,provider.getSigner());
            const response = await contract.consultPatient(info.addr,info.id,Gname.join(", "),Gfrequency.join(", "), Gdays.join(", "),formInput.remarks,"1");
            await response.wait()
            .then( () => {
                toast.success("Patient Consulted Successully.", {
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
        <SideBar/>
        <div className = "ccontent">
            <div className = "citems">
                <div className = "medicines">
                    <div className = "mhdr">
                        <h2>Medicines Recommended:</h2>
                        <div className = "meeting">
                            <h3><Link to = "/conference">Meeting Room</Link></h3>
                        </div>
                    </div>
                    <div className = "mtable">                 
                    <table className="t">
                        <thead>
                            <tr>
                                <th>Dose Name</th>
                                <th>Frequency/Day</th>
                                <th>No. Of Days</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {addedRows.map((row, index) => (
                            <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.frequency}</td>
                            <td>{row.days}</td>
                            <td>
                            <div className="nbtn">
                            <button onClick={() => handleDeleteRow(index)}>Delete</button>
                            </div>
                            </td>
                            </tr>
                        ))}
                        <tr>
                        <td>
                            <div className="ip">
                                <input
                                type="text"
                                name="name"
                                value={medicineInput.name}
                                onChange={handleMedicineChange}
                                placeholder="Dose"
                                required
                                />
                            </div>
                            </td>
                            <td>
                            <div className="ip">
                                <input
                                type="text"
                                name="frequency"
                                value={medicineInput.frequency}
                                onChange={handleMedicineChange}
                                placeholder="Frequency/Day"
                                required
                                />
                            </div>
                            </td>
                            <td>
                            <div className="days">
                                <input
                                type="text"
                                name="days"
                                value={medicineInput.days}
                                onChange={handleMedicineChange}
                                placeholder="No Of Days"
                                required
                                />
                            </div>
                            </td>
                            <td>
                            <div className="nbtn">
                            <button onClick={handleAddNewRow}>Add New</button>
                            </div>
                            </td>
                        </tr>
                        </tbody>
                        </table>
                        </div>
                </div>
                <div className = "remarks">
                    <h2>Remarks or Any Medical Tests Recommended:</h2>
                    <div className = "textarea">
                            <textarea name="remark/test" onChange={
                            (prop) => setFormInput({
                            ...formInput,
                            remarks: prop.target.value
                            })
                        } placeholder="Remarks or Any Tests Recommended" required/></div>
                </div>
                <div className = "epsbtn">
                    <button onClick = {consultPatient}>Consult</button>
                </div>
            </div>
        </div>
        <ToastContainer/>
        </>
    );
}