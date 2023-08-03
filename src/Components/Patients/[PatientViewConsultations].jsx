import SideBar from "./PateintsSideBar";

import { useLocation}  from "react-router-dom";
import { ToastContainer } from 'react-toastify';

export default function PatientViewConsultation(){

    const fetched_data = useLocation();
    const useful_data = fetched_data.state.data;
    const m_names = useful_data.name.split(", ");
    const m_freq =  useful_data.frequency.split(", ");
    const m_days = useful_data.day.split(", ");

    return(
        <>
        <SideBar/>
        <div className = "ccontent">
        <div className = "citems">
            <div className = "medicines">
                <div className = "mhdr">
                    <h2>Medicines Recommended:</h2>
                </div>
                <div className = "mtable">                 
                <table className = "t">
                    <thead>
                        <tr>
                            <th>Dose Name</th>
                            <th>Frequency/Day</th>
                            <th>No. Of Days</th>
                        </tr>
                    </thead>
                    <tbody>
                    {m_names.map((name, index) => (
                        <tr key={index}>
                        <td>{name}</td>
                        <td>{m_freq[index]}</td>
                        <td>{m_days[index]}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>
            </div>
            <div className = "remarks">
                <h2>Remarks or Any Medical Tests Recommended:</h2>
                <div className = "textarea">
                    <textarea name="remark/test"  value = {useful_data.remarks} required/>
                </div>
            </div>
        </div>
    </div>
    <ToastContainer/>
    </>
    );
}