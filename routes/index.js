var express = require('express');
var router = express.Router();
const usermodel = require("./users")
const postmodel = require("./posts")
const upload = require("./multer")
const passport = require('passport');

const localstrategy = require("passport-local")
passport.use(new localstrategy(usermodel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash("error")});
  // console.log(req.flash("error"))
  
});


router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await usermodel.findOne({ username:req.session.passport.user});

  res.render("feed",{user})
});

router.get('/createpost', isLoggedIn, async function(req, res, next) {
  const user = await usermodel.findOne({ username:req.session.passport.user});

  res.render("add",{user})
});

router.post('/uploadpost', isLoggedIn,upload.single("postimage"),async function(req, res, next) {
  const user = await usermodel.findOne({ username:req.session.passport.user});
 const post = await postmodel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect("/profile")
});

router.post('/register', function(req, res, next) {
     const user = new usermodel({
      username:req.body.username,
      email:req.body.email,
      password:req.body.password,
      fullname:req.body.fullname
      
  })
      usermodel.register(user,req.body.password)
     .then(function(userregister){
      passport.authenticate("local")(req,res,function(){
      res.redirect("/feed")
    })
  })
});

router.post('/login',passport.authenticate("local",{
  successRedirect:"/feed"  ,
  failureRedirect:"/login",
  failureFlash:true

}),function(req,res,next) {})


router.get('/logout',function(req, res, next) {
  req.logout(function(err){
      if (err){
        return next(err);
      }
      res.redirect("/")
})
});



router.get('/profile',isLoggedIn, upload.single("file"),async function(req, res, next) {
  const user = 
  await  usermodel 
  .findOne({ username:req.session.passport.user})
  .populate("posts")
  const post = await postmodel
  .find()
  .populate("user")
  res.render("profile",{user,post})
   
});

router.get('/pin/:data',isLoggedIn, upload.single("file"),async function(req, res, next) {
  const user = 
  await  usermodel 
  .findOne({ username:req.session.passport.user})
  // console.log(req.params.image)
  const post = await postmodel.findOne({_id:req.params.data})
  console.log(post)
  res.render("pin",{user,post})
   
});
router.get('/showposts',isLoggedIn, upload.single("file"),async function(req, res, next) {
  const user = 
  await  usermodel 
  .findOne({ username:req.session.passport.user})
  .populate("posts")
 const post =  await postmodel
  .find()
  .populate("user")
  res.render("show",{user})
   
});



router.post('/upload',isLoggedIn, upload.single("file"),async function(req, res, next) {
  if(!req.file){
   return res.status(400).send("no files were uploaded.")
  }

  const user = await usermodel.findOne({ username:req.session.passport.user});
  user.image = req.file.filename
  await user.save();
  res.redirect("/profile")
  // console.log(req.file)

});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/")
  }
}


module.exports = router;













