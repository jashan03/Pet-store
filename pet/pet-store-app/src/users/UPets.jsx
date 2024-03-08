import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
function Pets() {
    const [pets, setPets] = useState([]);
    // const { petId } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        //     fetch("http://localhost:3000/admin/courses", {
        //         method: "GET",
        //         headers: {
        //             "Authorization": "Bearer " + localStorage.getItem("token")
        //         }  
        //     }).then((res) => {
        //         res.json().then((data) => {
        //             setCourses(data);
        //         })
        //     })
        axios.get("http://localhost:3000/user/pets", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setPets(res.data.animals);
        })
    }, []);
    return <div style={{ display: "flex" }}>
        PETS
        {/* courses is an object so need to stringify */}
        {/* {JSON.stringify(pets)}  */}
        {pets.map((pet) => (
            <div key={pet._id}>
                <Card style={{
                    border: "2px solid black",
                    margin: 10,
                    width: 300
                }}>
                    {/* title description all these from backend */}
                    <Typography textAlign={"centre"} variant="h4">{pet.title}</Typography>
                    <Typography textAlign={"centre"} variant="h4">{pet.description}</Typography>
                    <Typography textAlign={"centre"} variant="h4">{pet.price}</Typography>
                    <img style={{ width: 300, height: 200 }} src={pet.imageLink}></img>
                    {/* <UpdateCard pet={pet}/> */}
                    <div>
                        <Button onClick={async () => {
                           navigate("/upet/" + pet._id);
                        }}>
                            Purchase
                        </Button>
                    </div>
                </Card>
            </div>
        ))}


    </div>
}
export function Course(props) {
    const navigate = useNavigate();
    return <Card style={{
        border: "2px solid black",
        margin: 10,
        width: 300
    }}>
        {/* title description all these from backend */}
        <Typography textAlign={"centre"} variant="h4">{props.course.title}</Typography>
        <Typography textAlign={"centre"} variant="h4">{props.course.description}</Typography>
        <Typography textAlign={"centre"} variant="h4">{props.course.price}</Typography>
        <img style={{ width: 300, height: 200 }} src={props.course.imageLink}></img>
        <div><Button onClick={() => {
            // _id is the convention used for id's
            navigate("/pet/" + props.course._id);
        }}>
            Edit
        </Button></div>
    </Card>
}

export default Pets;