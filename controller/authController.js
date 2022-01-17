const util = require('util')
const jwt = require('jsonwebtoken')
const { pool } = require('../database')
const bcrypt = require('bcrypt')

exports.restrictTo = (role)=>{

    return (req,res,next)=>{
        if(role===req.user.role)
            return next()
        else return res.status(400).json({
            status:'fail',
            message:'Access Denied'
        })
    }

}

const signtoken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = async (user, statusCode, res) => {

    let token = signtoken(user.user_id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })

}


exports.signup = async (req, res) => {
    try {
        console.log(req.body)
        let { name, email, role, password, phone } = req.body
        let passwordHashed = await bcrypt.hash(password, 10)

        const data = await pool.query(`INSERT INTO users(name,email,role,phone,password,passwordhashed) VALUES($1,$2,$3,$4,$5,$6) returning *`,
            [name, email, role, phone, password, passwordHashed]
        )

        createSendToken(data.rows[0], 201, res)

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.login = async (req, res) => {

    try {

        if (!req.body.email || !req.body.password)
            return res.status(400).json({
                status: 'Fail',
                message: 'Please provide email or password'
            })

        const user = await pool.query(
            `select * from users where email = ($1)`,
            [req.body.email]
        )
           

        if (user.rows.length == 0)
            return res.status(400).json({
                status: 'Fail',
                message: 'No user found with this email id'
            })

        let correctPass = await bcrypt.compare(req.body.password, user.rows[0].passwordhashed)

        if (correctPass === false)
            return res.status(400).json({
                status: 'Fail',
                message: 'Incorrect password'
            })

        createSendToken(user.rows[0], 201, res)


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }

}

exports.protect = async(req,res,next)=>{

    try {
      
        let token  
        //1)get token and check if its there
               if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                token = req.headers.authorization.split(' ')[1];
               } else if(req.cookies.jwt){
               token = req.cookies.jwt
               }
        
               
              if(!token) 
        return res.status(400).json({
            status: 'Fail',
            message: 'You are not logged in'
        })

    
         //2)validate token
             const decoded = await util.promisify(jwt.verify)(token,process.env.JWT_SECRET)


             let user = await pool.query(
                `SELECT * FROM users WHERE user_id = ($1)` ,
                 [decoded.id]
                )


            //  if(user.rows.length==0)
            //     return 
             req.user = user.rows[0]
             next()


    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }

}

exports.logout = (req,res)=>{
    // res.cookie('jwt','loggedout',{
    //     expiresIn:new Date(Date.now() + 10),
    //     httpOnly:true
    // })
    res.clearCookie('jwt')
    res.status(200).json({
        status:'success'
    })
}

exports.isAdmin  = async(req,res,next)=>{

    if(req.cookies.jwt){
        try {
            
            const decoded = await util.promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
           
            let user = await pool.query(
                `SELECT * FROM users WHERE user_id = ($1)` ,
                 [decoded.id]
                )
            
               req.user = user.rows[0]
                     next();


        } catch (err) {
          return next();
        }
    }

    next();

}