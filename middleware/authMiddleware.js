const jwt = require('jsonwebtoken');
const User = require('../models/user')





module.exports.requireAuth= (req, res, next) =>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'jawn', (err, decodedToken)=>{
                if(err){
                    res.redirect('/login')
                }
                else{
                    console.log(decodedToken)
                    next()
                }
        })
    }
    else{
        res.redirect('/login')
    }
    
}

module.exports.checkUser = (req, res, next) =>{
    const token = req.cookies.jwt;

        if(token){
            jwt.verify(token,"jawn", async (err, decodedToken)=>{
                if(err){
                    console.log(err)
                    res.locals.user = null;
                    next();   
                } else{
                    console.log(decodedToken)
                    const user = await User.findById(decodedToken.id)
                    res.locals.user = user;
                    next();
                }
            })
        } else{
            res.locals.user = null;
            next()
        }

}