import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuth } from '../context/auth.jsx'

function AccountActivate() {
    
    const {auth, setAuth} = useAuth();
    const {token} = useParams();
    console.log(token);
    const newToken = atob(token);
    console.log(newToken);
    const navigate = useNavigate()

    useEffect(() => {
        if (newToken) {
            reqActivation();  
        } 
    }, [newToken])

    const reqActivation = async () => {
        try {
            const { data } = await axios.post(`/register`, { newToken })
            if (data?.error) {
                toast.error(data.error);
            } else {
                // Save in local storage
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth(data);
                toast.success("You are registered successfully");
                navigate("/") 
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong. Please try again");
        }
    }

    return (
        <div>
            Please wait...
        </div>
    )
}

export default AccountActivate
