import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
export default function RegisterNEW() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        isDoctor: false,
        termAgree: false
    })
    const registerUser = async (e) => {
        e.preventDefault();
        const { name, email, password, isDoctor, termAgree } = data
        try {
            const { data } = await axios.post('/registerNEW', {
                name, email, password, isDoctor, termAgree
            })
            if (data.error) {
                toast.error(data.error)
            } else {
                if (data.termAgree) {
                    console.log("Form submitted")
                    setData({})
                    toast.success('Login Successful. Welcome!')
                    navigate('/login')
                } else {
                    alert("You must agree to the terms and conditions")
                }

            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <form onSubmit={registerUser}>
                <label>Name</label>
                <input type="text" placeholder="enter name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}></input>
                <label>Email</label>
                <input type="email" placeholder="enter email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}></input>
                <label>Password</label>
                <input type="password" placeholder="enter password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })}></input>
                <label>Are you a doctor?</label>
                <input
                    type="radio"
                    value={true}
                    checked={data.isDoctor === true}
                    onChange={() => setData({ ...data, isDoctor: true })}
                /> Yes
                <input
                    type="radio"
                    value={false}
                    checked={data.isDoctor === false}
                    onChange={() => setData({ ...data, isDoctor: false })}
                /> No
                <div></div>
                <input
                    type="checkbox"
                    checked={data.termAgree}
                    onChange={() => setData({ ...data, termAgree: !data.termAgree })} // Toggle the state
                />
                Terms and Conditions: By filling this, you agree for us to use your personal information that might be implmented into our service.Agree?
                <div></div>
                <button type='submit' disabled={!data.termAgree}>Submit</button>
            </form>

        </div>
    )
}