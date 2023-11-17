import bcrypt from "bcrypt";

// convert the plain password to the hash string so it can be stored easily in the database
export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt)=>{
            if(err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err,hash)=>{
                if(err) {
                    reject(err);
                }
                resolve(hash);
            })
        })
    })
}

// compare the hashed password with actual password
export const comparePassword = (password, hashedVersion) => {
    return bcrypt.compare(password, hashedVersion);
}