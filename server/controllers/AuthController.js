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


const tokenAndUserResponse = (res, user) => {
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
}

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
        if(password && password?.length < 7){
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

    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.json({error: "user already exists"});
    }

    // hashing of password
    const hashedPassword = await hashPassword(password);

    // saving the user in database
    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();

    tokenAndUserResponse(res, user);

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
        tokenAndUserResponse(res, user);

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

// Access your account without password
export const accessAccount = async (req, res) => {
    try {
        const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);

        const user = await User.findOneAndUpdate({ resetCode },{resetCode: ''});

        tokenAndUserResponse(res, user);

    } catch (err) {
        console.log(err);
        return res.json({ error: "Something went wrong. Try again." });
    }
}

// to refresh the expired token
export const refreshToken = async (req, res) => {
    try {
        const {_id} = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);
        
        const user = await User.findById(_id);

        tokenAndUserResponse(res, user);

    } catch (err) {
        console.log(err);
        return res.status(403).json({error: "Refresh token failed."});
    }
}

// To see the currently logged in users in mongoDB
export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(403).json({error: "Unauthorized user"});
    }
}

// To see the users profile
export const publicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username});
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);
    } catch (err) {
        console.log(err);
        return res.json({error: "User not found"});
    }
}

// To change the password
export const updatePassword = async (req, res) => {
    try {
        const {password} = req.body;

        // Checking if the password is valid according to paramenters or not
        if(!password) {
            return res.json({error: "Empty password"});
        }
        if (password && password?.length < 8) {
            return res.json({error: "Password is too short"});
        }

        // Will update your password in database
        const user = await User.findByIdAndUpdate(req.user._id, {
            password: await hashPassword(password),
        });
        
        res.json({status: "Password updated successfully"});
        res.json({user});
    } catch (err) {
        console.log(err);
        return res.status(403).json({error: "Unauthorized user"});
    }
}

// To update the profile
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id,req.body,{new:true});
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);
    } catch (err) {
        console.log(err);
        if(err.codeName === "DuplicateKey"){
            return res.json({error : "Username or email is already taken"});
        }
        
    }
}