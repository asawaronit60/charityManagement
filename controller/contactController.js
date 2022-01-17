const { pool } = require('../database')

exports.getAllcontact = async(req,res)=>{
    try {
        
        let contacts = await pool.query(`select * from contacts`)

        res.status(200).json({
            status:'success',
            data:contacts.rows
        })

    } catch (err) {
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }
}

exports.createContact = async(req,res)=>{
    try {
        
        let {name,email,message} = req.body
        await pool.query(`INSERT INTO contacts(name,email,message) values($1,$2,$3)` , [name,email,message])

        res.status(200).json({
            status:'success'
        })

    } catch (err) {
        res.status(400).json({
            status:'fail',
            message:err.message
        })
        
    }
}