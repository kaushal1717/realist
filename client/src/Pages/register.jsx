import React from 'react'
import '../index.css'
import { Button, colors } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

function Register() {

    const [username,setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            setLoading(true);
            const {data} = await axios.post(`/pre-register`,{ email, password });
            if (data?.error) {
                toast.error(data.error);
                setLoading(false);
            } else {
                toast.success("Check your email for registration");
                setLoading(false);
                navigate("/");
            }
            console.log(data);
        }catch(err) {
            console.log(err);
            toast.error("Something went wrong. Please try again");
            setLoading(false);
        }
    }

    return (
        <>
            <div className='flex flex-col justify-center align-middle h-screen'>
                <form className="reg-form-container" onSubmit={handleSubmit}>
                    <h2 className='text-4xl text-white font-bold text-center'> REGISTER </h2>
                    <div className='form-label'>
                        <label>User Name</label>
                        <input type="text" className='input-field' required autoFocus onChange={e => setUsername(e.target.value)} value={username}/>
                    </div>
                    <div className='form-label'>
                        <label>Email</label>
                        <input type="email" className='input-field' required autoFocus onChange={e => setEmail(e.target.value)} value={email}/>
                    </div>
                    <div className='form-label'>
                        <label>Password</label>
                        <input type="password" className='input-field' required autoFocus onChange={e => setPassword(e.target.value)} value={password}/>
                    </div>
                    <Button variant="contained"
                        disabled = {loading}
                        sx={{
                            bgcolor: colors.blue[800],
                            borderRadius: "8px",
                            alignSelf: "center",
                            width: "100%",
                            marginTop: "10px"
                        }} type='submit'
                    >
                        {loading ? "Loading..." : "Submit"}
                    </Button>
                </form>
            </div>
        </>
    )
}

export default Register