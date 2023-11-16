import * as config from "../config.js"
import jwt from "jsonwebtoken";

export const welcome = (req,res) => {
    res.json({
        data:"Hello world from auth controller"
    });
};

export const preRegister = async (req, res) => {
    try {
        const {email, password} = req.body
        const token = jwt.sign({email, password}, config.JWT_SECRET, {expiresIn: "1h"})
        config.AWSSES.sendEmail({
            Source: config.EMAIL_FROM,
            Destination: {
                ToAddresses: ["kaushalpadaliya.aids21@scet.ac.in"],
            },
            Message: {
                Body:{
                    Html:{
                        Charset: "UTF-8",
                        Data: `
                            <html>
                                <h1> Welcome to realist </h1>
                                <p> You are one step closer to register yourself. Please click the link given below to activate your account</p>
                                <a href="${config.CLIENT_URL}/auth/accountactivate/${token}">Activate your account</a>
                            </html>
                        `
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Welcome to realist"
                }
            }
        },(err,data)=>{
            if (err) {
                console.log(err);
                return res.json({status: "not sent"});
            } else {
                console.log(data);
                return res.json({status: "sent"});
            }
        }
    );  
    } catch (err) {
        console.log(err);
        return res.json({error: 'Something went wrong try again'})
    }
}

export const register = async (req, res) => {
    try {
        console.log(req.body);
    } catch (err) {
        console.log(err);
        return res.json({
            error: "Something went wrong try again !!"
        })
    }
}