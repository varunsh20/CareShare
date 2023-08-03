import { useState } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from "./Components/Navbar/Navbar";
import Doctor from './Components/Doctors/Doctors';
import Appointments from './Components/Doctors/Appointments';
import PConsultations from './Components/Doctors/PConsultations';
import Patient from './Components/Patients/Patients';
import History from './Components/Patients/History';
import PAppointments from './Components/Patients/PAppointments';
import Home from './Components/Home/Home';
import PatientRegister from './Components/Register/PatientRegister';
import DoctorRegister from './Components/Register/DoctorRegister';
import Available from './Components/Doctors/AvailableDoctors';
import VisitingPatient from './Components/Visiting/[VisitingPatient]';
import VisitingDoctor from './Components/Visiting/[VisitingDoctor]';
import VisitingHistory from './Components/Visiting/[VisitingHistory]';
import Consult from './Components/Doctors/[Consult]';
import ViewConsultation from './Components/Doctors/[ViewConsultation]';
import PatientViewConsultation from './Components/Patients/[PatientViewConsultations]';
import VisitingDoctorConsultation from './Components/Visiting/[VisitngDoctorConsultation]';
import Conference from './Components/Meeting/Conference';
import hsp  from "./assets/hsp.jpg"

function App() {


  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/patientRegister" element = {<PatientRegister/>}/>
        <Route path = "/doctorRegister" element = {<DoctorRegister/>}/>
        <Route path = "history" element = {<History/>}/>
        <Route path = "pappointments" element = {<PAppointments/>}/>
        <Route path = "pconsultations" element = {<PConsultations/>}/>
        <Route path = "appointments" element = {<Appointments/>}/>
        <Route path = "patientsProfile" element = {<Patient/>}/>
        <Route path = "doctorsProfile" element = {<Doctor/>}/>
        <Route path = "viewDoctors" element = {<Available/>}/>
        <Route path = "/doctor/:addr" element = {<VisitingPatient/>}/>
        <Route path = "/patient/:addr" element = {<VisitingDoctor/>}/>
        <Route path = "/history/:addr" element = {<VisitingHistory/>}/>
        <Route path = "/consult/:addr/:id" element = {<Consult/>}/>
        <Route exact path = "/viewConsulation" element = {<ViewConsultation/>}/>
        <Route exact path = "/patientConsulation" element = {<PatientViewConsultation/>}/>
        <Route exact path = "/showConsulation" element = {<VisitingDoctorConsultation/>}/>
        <Route path = "/conference" element = {<Conference/>}/>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
