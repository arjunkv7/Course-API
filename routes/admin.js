var express = require('express');
var router = express.Router();
var courseHelper = require('../helpers/course-helper')
var adminHelper = require('../helpers/admin-helper')
var fs = require('fs');
const { ObjectId } = require('mongodb');

// Verify Login middleware

const verifyLogin = (req, res, next) => {
  if (req.session.adminLogin)
    next()
  else {
    res.redirect('/login')
    
  }
}

/* GET home page. */
router.get('/', verifyLogin, function (req, res, next) {

  courseHelper.getCourses().then((courses) => {
    console.log(courses)
    res.render('./admin/view-courses', { courses });
  })

});

/* Get login page */
router.get('/login', (req, res) => {
  res.render('./admin/login')
})

/* Do login */
router.post('/login', (req, res) => {
  console.log('login post')

  adminHelper.doLogin(req.body).then((response) => {
    console.log(response)
    if (response.admin) {
      console.log('login success')
      req.session.adminLogin = true;
      res.redirect('/')
    }
    else if (response.loginErr) {
      let error = response.loginErr
      res.render('./admin/login', { error })
    }
  })
})

/*Get addcourse page */
router.get('/addcourse', verifyLogin, (req, res) => {
  res.render('./admin/add-course')
})

router.post('/addcourse', verifyLogin, (req, res) => {
  console.log(req.body)
  courseHelper.addcourse(req.body).then((data) => {
    let image = req.files.courseimage
    let certificate=req.files.certificate

    certificate.mv('./public/certificateImages/' + data + 'certificate.jpg', (err, data) => {
      if (err) console.log(err)
      else console.log('certificate stored')
    })

    image.mv('./public/courseImages/' + data + '.jpg', (err, data) => {
      if (err) console.log(err)
      else res.redirect('/')
    })

    console.log('data added')
  })
})

router.get('/edit-course/', verifyLogin, (req, res) => {
  console.log(req.query.courseId)
  courseHelper.getCourseDetails(req.query.courseId).then((courseDetails) => {
    console.log(courseDetails )
    res.render('./admin/edit-course', { courseDetails })
  })
})

router.post('/edit-course/:courseId', (req, res) => {
  var newDetails = req.body;
  console.log(newDetails)
  var courseId = req.params.courseId
  var newImage = req.files.courseimage;
  var newCertificate=req.files.certificate;
  fs.unlink('./public/courseImages/' + courseId + '.jpg',  (err, data) => {
    console.log('old image deleted')
  })
  fs.unlink('./public/certificateImages/' + courseId + 'certificate.jpg',  (err, data) => {
    console.log('old image deleted')
  })

  newCertificate.mv('./public/certificateImages/' + courseId + 'certificate.jpg', (err, data) => {
    if (err) console.log(err)
    else console.log(data)
  })

  newImage.mv('./public/courseImages/' + courseId + '.jpg', (err, data) => {
    if (err) console.log(err)
    else console.log(data)
  })
  courseHelper.editCourse(courseId, newDetails).then((data) => {
    res.redirect('/')
  })
})

router.get('/delete-course/:courseId',verifyLogin,(req,res)=>{
  var courseId=req.params.courseId
  courseHelper.deleteCourse(courseId).then((data)=>{
    console.log('course deleated')
    res.redirect('/')
  })
})

router.post

module.exports = router;
