import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";
import "./account.scss";
export default function Account() {
    const { user, setUser } = useContext(UserContext);
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [location,setLocation] = useState("");
    const [experience,setExperience] = useState(0);
    const [error, setError] = useState("");
    const [image,setImage] = useState(null);
    const [preview, setPreview] = useState(user?.profilePic || null); // Display profile picture

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Preview image before upload
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { name, password, specialty: specialty || user.specialty,
            location: location || user.location,
            experience: experience || user.experience, 
            if(image){
                image:image || user.profilePic
            }
         };
         

        // Send the updated data to the backend
        const response = await fetch('http://localhost:8000/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include', // To send the token in cookies
        });

        const result = await response.json();
        if (result.error) {
            setError(result.error);
        } else {
            setUser(result); // Update the user context
            alert('User updated successfully');
        }
    };
    if (!user) {
        return <Navigate to="/login" />;
    }

    
    if (user) {
        return (
            <div className="account">
                <div className="card">
                    <div className="right">
                        <h1>ACCOUNT</h1>
                        {!!user && user.name && <h2>HI {user.name}!</h2>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={name}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                {!!user && user.email && <h2> {user.email}</h2>}
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter New Password"
                                />
                            </div>
                            {user && user.isDoctor == true && 
                            <div>
                            <div>
                                <label>Specialty:</label>
                                <input
                                    type="text"
                                    value={specialty}
                                    placeholder={user.specialty || "Enter specialty"}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Experience:</label>
                                Years of Experience: {user.experience}
                                
                                <input 
                                type="number"
                                value={experience}
                                placeholder={user.experience || "Enter Years of Experience"}
                                onChange={(e)=>setExperience(e.target.value)}
                                min="0"
                                />
                            </div>
                            <div>
                                <label>Location:</label>
                                <input 
                                type="text"
                                value={location}
                                placeholder={user.location || "Enter Address of Office"}
                                onChange={(e)=>setLocation(e.target.value)}
                                />
                            </div>
                            </div>
                            }
                            <button type="submit">Update</button>
                        </form>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                </div>
            </div>
        );
    }
}
