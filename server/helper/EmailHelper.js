import * as config from "../config.js";

const style = `
    background: #eee;
    padding: 20px;
    border-radius: 20px;
`
// Simple email template to send the user for account acitivation
export const welcomeTemplate = (email, content, replyTo, subject) => {
    return {
        Source: config.EMAIL_FROM,
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body:{
                Html:{
                    Charset: "UTF-8",
                    Data: `
                        <html>
                            <div style="${style}">
                                <h1> Welcome to realist </h1>
                                ${content}
                                <p> &copy; ${new Date().getFullYear()}
                            </div>
                        </html>
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject
            }
        }
    }
}

// Simple email template to send the user to reset the password

export const forgotPasswordTemplate = (email, content, replyTo, subject) => {
    return {
        Source: config.EMAIL_FROM,
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body:{
                Html:{
                    Charset: "UTF-8",
                    Data: `
                        <html>
                            <div style="${style}">
                                <h1> Realist </h1>
                                ${content}
                                <p> &copy; ${new Date().getFullYear()}
                            </div>
                        </html>
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject
            }
        }
    }
}