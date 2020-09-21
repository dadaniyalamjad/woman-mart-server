const ejs = require("ejs");
const fs = require("fs");
const Config = require("../config/index")
const mandrill = require("node-mandrill")(Config.Email.ApiKey);


module.exports = {
    email_sender: async (message, user, fileName) => {
        return new Promise(async (resolve, reject) => {
            console.log("email", user[0].email)
            await fs.exists(__dirname + "/template/" + fileName, async exists => {
                if (exists) {
                    await ejs.renderFile(
                        __dirname + "/template/" + fileName,
                        { name: user[0].firstName + " " + user[0].lastName, message },

                        async (err, html) => {
                            if (err) {
                                reject(
                                    new Error.InternalServerError(
                                        `Error in render ejs template html ${err}`
                                    )
                                );
                            }

                            let _message = {
                                to: [{ email: user[0].email }],

                                from_email: Config.Email.From,
                                subject: "Testing",
                                html: html
                            };
                            // console.log("message", _message)
                            mandrill(
                                "/messages/send",
                                {
                                    message: _message
                                },
                                (error, response) => {
                                    if (error) {
                                        console.log(`Email error`, error);
                                        reject(
                                            new Error.InternalServerError(
                                                `Mandrill send email function error : ${error}`
                                            )
                                        );
                                    }
                                    console.log(`email response`, response);

                                    resolve(
                                        `Email sent successfully Response : ${JSON.stringify(
                                            response
                                        )}`
                                    );
                                }
                            );
                        }
                    );
                }
            });
        });
    }
};