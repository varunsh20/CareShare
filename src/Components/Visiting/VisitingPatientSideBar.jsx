import lg from "../../assets/lg.png"
import "./visitingpatient.css";


export default function VisitingPatientSideBar(){
    return(

         <>
        <div className="cntnt">
            <div className="sidebar">
                <div className="profile">
                    <div className="log">
                        <img src = {lg} alt="logo"></img>
                    </div>
                    <div className = "items">
                        <div className="product">
                        <p>
                        Basic Info
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}