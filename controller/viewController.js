const {pool} = require('../database')
const axios = require('axios')
exports.getHome = async(req,res)=>{
        
    try {
        let role;
        let isloggedin = false   
        if(req.cookies.jwt){
            isloggedin=true
            role = req.user.role;
}
            else role=null
      
        res.status(200).render('index',{role , user:req.user , isloggedin})

    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    }
}

exports.getAbout = async(req,res)=>{
   
    try {

        res.status(200).render('About')

    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    } 
}

exports.getAdmin = async(req,res)=>{
   
    try {
        let arr = [];

        let users = await pool.query(`
        select u.name , u.role , u.email, (d.amount) from users u ,donations d where u.user_id = d.user_id order by d.donation_id desc;
        `)

        let causes = await pool.query(`select c.cause_name , c.cause_id ,c.goal, sum(d.amount) from causes c , donations d 
            where c.cause_id = d.cause_id group by c.cause_id
        `)
        let contacts = await pool.query(`select * from contacts order by contact_id desc`)

        console.log(causes.rows)
        res.status(200).render('admin' , {users:users.rows , causes:causes.rows , contacts:contacts.rows})

    } catch (err) {
        console.log(err)
        res.status(200).json({
            status:'success',
            message:err.message
        })
    } 
}
exports.getContact = async(req,res)=>{
   
    try {
        res.status(200).render('contact')

    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    } 
}

exports.getLogin = async(req,res)=>{

    try { 
        res.status(200).render('login')
        
    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    }

}

exports.getBlogs = async(req,res)=>{
    try {

            let blogs = await pool.query(`select * from blogs`)

        res.status(200).render('blog', {blogs:blogs.rows})

    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    }
}

exports.getCause = async(req,res)=>{
    try {
        
        let causes = await axios({
            method:'get',
            url:'http://localhost:3000/api/v1/cause'
        }) 
      
        res.status(200).render('cause',{causes:causes.data.data})

    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    }
}

exports.createCause = async(req,res)=>{
    try {
        res.status(200).render('create_cause')
    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    }
}

exports.createBlog = async(req,res)=>{
    try {
        res.status(200).render('create_blog')
    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        })
    }
}

exports.signup = async(req,res)=>{
    try {
        res.status(200).render('signup')
    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        }) 
    }
}

exports.getCauseDetails = async(req,res)=>{
    try {
        let id = req.params.id
        
        let cause = await pool.query(`select * from causes where cause_id = $1` , [id])
        
        res.status(200).render('causeDetail',{cause:cause.rows[0]})

    } catch (err) {
        res.status(200).json({
            status:'success',
            message:err.message
        }) 
    }
}