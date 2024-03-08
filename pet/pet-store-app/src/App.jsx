import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";
import Signup from './Signup'
import Signin from './Signin';
import AddPet from './AddPet';
import Appbar from './Appbar';
import Pets from './Pets';
import Pet from './Pet';
// users
import USignup from './users/USignup';
import USignin from './users/USignin';
import UPets from './users/UPets';
import UPet from './users/UPet';
import UAppbar from './users/UAppbar';
import './App.css'



function App() {

  const [userName, setUserName] = useState(null);
  const [userType, setUserType] = useState("");
  useEffect(() => {
      fetch('http://localhost:3000/admin/me', {
          method: "GET",
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
      .then(res => res.json())
      .then((data) => {
          if (data.name) {
              setUserName(data.name);
              setUserType("admin");
          }
      });
  }, []);
  useEffect(() => {
    fetch('http://localhost:3000/user/me', {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then((data) => {
        if (data.name) {
            setUserName(data.name);
            setUserType("user");
        }
    });
}, []);
  return (
    <div style={{
      width: "100vw",
      height: "100vw",
      backgroundColor: "#eeeeee"
    }} >
      <Router>
   
      {userType==="Admin"?<Appbar userName={userName} setUserName={setUserName}></Appbar>:<UAppbar userName={userName} setUserName={setUserName}></UAppbar>}
        <Routes>
        
        <Route path="/pets" element={<Pets />} /> 
        <Route path="/pet/:petId" element={<Pet />} /> 
          <Route path="/addpet" element={<AddPet />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signin" element={<Signup />} />
          {/* Users */}
          <Route path="/userlogin" element={<USignin />} />
          <Route path="/usersignup" element={<USignup />} />
          <Route path="/upets" element={<UPets />} />
          <Route path="/upet/:petId" element={<UPet />} />  

          {/* <Route path="/userSignup" element={<UserSignup />} /> */}
        </Routes>
      </Router>

    </div>
  )
}

export default App;
