import * as config from "../config.js"
import jwt from "jsonwebtoken";
import { welcomeTemplate, forgotPasswordTemplate } from "../helper/EmailHelper.js";
import { hashPassword, comparePassword } from "../helper/PasswordHashing.js";
import User from "../Models/UserModel.js"
import { nanoid  } from "nanoid";
import  validator  from "email-validator";

export const welcome = (req,res) => {
    res.json({
        data:"Hello world from auth controller"
    });
};

// send email for email validation afer clicking on activate account user account is created
export const preRegister = async (req, res) => {
    try {
        const {email, password} = req.body;

        // validating if the email is in valid format
        if(!validator.validate(email)){
            return res.json({error: "Invalid email"});
        }
        // validating if the password is non-empty
        if (!password) {
            return res.json({error: "Empty password"});
        }
        // validting if the password length is >= 8 char
        if(password && password?.length < 6){
            return res.json({error: "Password is too short"});
        }
        // validating if the user is already registered
        const user = await User.findOne({email});
        if(user){
            return res.json({error: "email is taken"});
        }

        // creating the jwt
        const token = jwt.sign({email, password}, config.JWT_SECRET, {expiresIn: "1h"});

        //sending the verification email
        config.AWSSES.sendEmail(welcomeTemplate(email, 
            `
                <p> You are one step closer to register yourself. Please click the link given below to activate your account</p>
                <a href="${config.CLIENT_URL}/auth/accountactivate/${token}">Activate your account</a>
            `,
            config.REPLY_TO,
            "Account Activation"
            ),(err,data)=>{
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
        return res.json({error: 'Something went wrong try again'});
    }
}

// register the new user and save it to the database
export const register = async (req, res) => {
  try {
    // console.log(req.body);
    // verify jwt in order to get the user information
    const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);

    // hashing of password
    const hashedPassword = await hashPassword(password);

    // saving the user in database
    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();

    // create token
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.resetCode = undefined;

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

// function for login of the existing user
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        // finding user by email
        const user = await User.findOne({email});
        
        // compare password
        const match = await comparePassword(password, user.password);
        // console.log("match function run successfully");
        if(!match){
            return res.json({ error: "Wrong password"});
        }

        // create the jwt tokens
        const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
            expiresIn: "7d",
        });

        // send the response
        user.password = undefined;
        user.resetCode = undefined;
        
        return res.json({
            token,
            refreshToken,
            user,
          });
    } catch (err) {
        console.log(err);
        return res.json({ error: "Something went wrong. Try again." });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({ email });

        // checking if user exist or not
        if(!user){
            return res.json({error: "user not foud"});
        }
        else{
            // create a unique id to reset the password and store to the datavse
            const resetCode = nanoid();
            user.resetCode = resetCode;
            user.save();

            // create a jwt to reset the password
            const token = jwt.sign({resetCode}, config.JWT_SECRET, {
                expiresIn: "1h"
            });

            // sending the email to reset the password
            config.AWSSES.sendEmail(
                forgotPasswordTemplate(email,
                `
                    <p> Please click the link below to access your account </p>
                    <a href="${config.CLIENT_URL}/auth/access-account/${token}"> access your account </a>   
                `, 
                config.REPLY_TO, 
                "Access your account"),
                (err,data)=>{
                    if (err) {
                        console.log(err);
                        return res.json({status: "not sent"});
                    } else {
                        console.log(data);
                        return res.json({status: "sent"});
                    }
                }
            );
            
        }
    } catch (err) {
        console.log(err);
        return res.json({ error: "Something went wrong. Try again." });
    }
}

export const accessAccount = async (req, res) => {
    try {
        const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);

        const user = await User.findOneAndUpdate({ resetCode },{resetCode: ''});

        const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
            expiresIn: "7d",
        });

        // send the response
        user.password = undefined;
        user.resetCode = undefined;
        
        return res.json({
            token,
            refreshToken,
            user,
          });
    } catch (err) {
        console.log(err);
        return res.json({ error: "Something went wrong. Try again." });
    }
}