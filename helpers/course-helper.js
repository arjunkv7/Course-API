const { ObjectId } = require('bson')
var collections = require('../configure/collections')
var db = require('../configure/connection')
var fs = require('fs');
const async = require('hbs/lib/async');


module.exports = {

    addcourse: (data) => {
        return new Promise((resoleve, reject) => {
            db.get().collection(collections.COURSE_COLLECTION).insertOne(data, (err, data) => {
                if (err) console.log(err)
                else console.log(data)
                resoleve(data.insertedId)
            })
        })

    },
    getCourses: () => {
        return new Promise((resoleve, reject) => {
            var courses = db.get().collection(collections.COURSE_COLLECTION).find().toArray()
            console.log(courses)
            resoleve(courses)
        })
    },

    editCourse: (courseId, newData) => {
        return new Promise((resolve, reject) => {
            console.log("edit coure fun")
            db.get().collection(collections.COURSE_COLLECTION).updateOne({ _id: ObjectId(courseId) },
                {
                    $set: {
                        coursename: newData.coursename,
                        univercity: newData.univercity,
                        learninghour: newData.learninghour,
                        duration: newData.duration,
                        qualification: newData.qualification,
                        price: newData.price,

                    }
                }, (err, data) => {
                    if (err) {
                        console.log(err)
                        }
                    else {
                        console.log(data)
                        console.log('data updated successfully')
                        resolve(data)
                    }

                })
        })
    },

    deleteCourse: (courseId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COURSE_COLLECTION).deleteOne({ _id: ObjectId(courseId) }, (err, data) => {
                if (err) console.log(err)
                else {
                    console.log(data)
                    resolve(data)

                    fs.unlink("./public/courseImages/" + ObjectId(courseId) + '.jpg', (data) => {
                        console.log(data)
                    })
                    fs.unlink("./public/certificateImages/" + ObjectId(courseId) + 'certificate.jpg', (data) => {
                        console.log(data)
                    })


                }
            })
        })
    },

    getCourseDetails: (courseId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.COURSE_COLLECTION).findOne({ _id: ObjectId(courseId) }, (err, courseDetails) => {
                if (err) console.log(err)
                else {
                    console.log(courseDetails)
                    resolve(courseDetails)
                }
            })

        })
    }



}