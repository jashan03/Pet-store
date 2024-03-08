import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

function UPet() {
  const [pet, setPet] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const { petId } = useParams(); // Make sure this matches the route parameter name in your backend, i.e., petId

  useEffect(() => {
    // console.log("Fetching pet with ID:", petId);
    axios.get(`http://localhost:3000/user/pet/${petId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        
        setPet(res.data.pet); //  pet data is returned as res.data.pet
      })
      .catch((error) => {
        console.error("Error fetching pet:", error);
      });
  }, [petId]);
  const handleSubmit = () => {
    axios.post(`http://localhost:3000/user/pet/${petId}`, {}, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then(() => {
      setIsPurchased(true); // Update state to indicate purchase
    })
    .catch((error) => {
      console.error("Error purchasing pet:", error);
      // You might want to handle the error state here
    });
  };
  if (!pet) {
    return <Typography variant="h4">Loading...</Typography>;
  }

  return (
    <div style={{display:"flex"}}>
    PET
     {/* courses is an object so need to stringify */}
     {/* {JSON.stringify(pet)}  */}
     {/* {pet.map((petItem)=>{
         return <Course course={petItem} />
     })} */}
     <Card style={{
        border: "2px solid black",
        margin: 10,
        width: 300
    }}>
    {/* title description all these from backend */}
 <Typography textAlign={"centre"} variant="h4">{pet.title}</Typography>
 <Typography textAlign={"centre"} variant="h4">{pet.description}</Typography>
 <Typography textAlign={"centre"} variant="h4">{pet.price}</Typography>
 <img style={{width:300, height:200}} src = {pet.imageLink}></img>
 <div>
                        <Button onClick={handleSubmit}>
                        {isPurchased ? <p>Purchased</p> :"Confirm to purchase"}
                        </Button>
                    </div>
    </Card>
     </div>
   
  );
}

export default UPet;