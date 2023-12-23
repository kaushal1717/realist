import React from 'react'
import '../index.css'
import { Button, colors } from '@mui/material'

function Register() {
    return (
        <>
            <div className='flex flex-col justify-center align-middle h-screen'>
                <form className="reg-form-container" action="">
                    <h2 className='text-4xl text-white font-bold text-center'> REGISTER </h2>
                    <div className='form-label'>
                        <label>User Name</label>
                        <input type="text" className='input-field' />
                    </div>
                    <div className='form-label'>
                        <label>Email</label>
                        <input type="email" className='input-field' />
                    </div>
                    <div className='form-label'>
                        <label>Password</label>
                        <input type="password" className='input-field' />
                    </div>
                    <Button variant="contained"
                        sx={{
                            bgcolor: colors.blue[800],
                            borderRadius: "8px",
                            alignSelf: "center",
                            width: "100%",
                            marginTop: "10px"
                        }}
                    >
                        Register
                    </Button>
                </form>
            </div>
        </>
    )
}

export default Register