const { model } = require('mongoose');
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const handleErrors = (err) =>{
console.log(err.message, err.code)
const errors = {email: "", password: ""};

  //Check if the email matched the password
    if(err.message == "invalid email"){
    errors.email = "Email does not match password";

    return errors;
    }

   //Check if the password matched the email
    if(err.message == "invalid password"){
        errors.password ="Password does not match the email";
      return errors;
    }

  //check if email is registered
    if(err.code == 11000){
    errors.email = "This email is already registered"
    return  errors;
    }
    if(err.message.includes('user validation failed')){
      Object.values(err.errors).forEach(({properties})=>{
        errors[properties.path] = properties.message;
      })
    }
    return errors;  
}


//create a JWT token here
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
  return jwt.sign({id}, "jawn", {
    expiresIn: maxAge
  })
}

module.exports.signup_get = (req, res) =>{
  res.render('signup')
}


module.exports.signup_post = (req, res) =>{
const {email, password} = req.body;
User.create({email, password})
.then((user)=>{
  const token = createToken(user._id)
  res.cookie("Jwt", token)
  res.status(200).json({user})
})
.catch((err)=>{
  const errors = handleErrors(err)
  res.status(400).json({errors})
})
}

module.exports.login_get = (req, res) =>{
res.render('login')
}

module.exports.login_post = async (req, res) => {
const {email, password} = req.body;
User.login(email, password)
.then((user)=>{
  const token = createToken(user)
  res.cookie('jwt', token)
  res.status(201).json({user})

})
.catch((err)=>{
  console.log(err)  
  const errors = handleErrors(err)
  res.status(400).json({errors})
})
}

module.exports.logout_get = (req, res) =>{
    res.cookie('jwt', '', {maxAge:0})
    res.redirect('/login')
}

