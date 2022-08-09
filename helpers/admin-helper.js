const bcrypt = require('bcryptjs')
const async = require('hbs/lib/async')
var collections = require('../configure/collections')
var db = require('../configure/connection')

module.exports = {

    adminSignUp: (adminDetails) => {
        return new Promise(async (resolve, reject) => {
            console.log(adminDetails)
            adminDetails.password = await bcrypt.hash(adminDetails.password, 10)
            console.log(adminDetails.password)
            db.get().collection(collections.ADMIN_COLLECTION).insertOne(adminDetails, (err, data) => {
                if (err) {
                    console.log(err)
                    console.log("data not added")
                }
                else {
                    console.log(data)
                    console.log("data  added")

                    resolve(data)
                }
            })

        })
    },
    doLogin: (signUpDetails) => {
        return new Promise(async (resolve, reject) => {

            let response = {}
            let admin = await db.get().collection(collections.ADMIN_COLLECTION).findOne({ username: signUpDetails.username })
            if (admin) {
                bcrypt.compare(signUpDetails.password, admin.password, (err, data) => {
                    if (err) {
                        console.log(err)

                    }
                    else if (data == true) {
                        console.log(data)
                        response.adminLogin = true;
                        response.admin = true

                    }
                    else if (data == false) {
                        response.loginErr = "Invalid Password"
                    }
                    resolve(response)
                })
            }
            else {
                response.loginErr = "Invalid Username";
                resolve(response)

            }

        })
    }






}
