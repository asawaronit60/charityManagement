const { pool } = require('../database')
const bcrypt = require('bcrypt')

exports.getAllUsers = async (req, res) => {
  try {

    if (req.user.role !== 'admin')
      return res.status(400).json({
        status: 'fail',
        message: 'Access Denied'
      })

    let data = await pool.query(`select * from users `);
    res.status(200).json({
      status: 'success',
      results: data.rows.length,
      data: data.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}

exports.getUser = async (req, res) => {

  try {

    let user = await pool.query(
      `select * from users where user_id = $1`,
      [req.params.id]
    )

    res.status(200).json({
      stauts: 'success',
      data: user.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

}

exports.me = async (req, res) => {
  try {

    let user = await pool.query(
      `select * from users where user_id = $1`,
      [req.user.user_id]
    )

    res.status(200).json({
      stauts: 'success',
      data: user.rows
    })


  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }


}

exports.createUser = async (req, res) => {
  try {

    let { name, email, role, password, phone } = req.body
    let passwordHashed = await bcrypt.hash(password, 10)

    const data = await pool.query(`INSERT INTO users(name,email,role,phone,password,passwordhashed) VALUES($1,$2,$3,$4,$5,$6) returning *`,
      [name, email, role, phone, password, passwordHashed]
    )

    res.status(200).json({
      status: 'success',
      data: data.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}


exports.deleteUser = async (req, res) => {
  try {
    let id = req.params.id;

    await pool.query(`DELETE FROM users where user_id = ($1)`, [id])
    res.status(200).json({
      status: 'success',
      data: 'User sucessfully deleted'
    })



  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}


exports.getMyDonations = async (req, res) => {

  try {

    let data = await pool.query(
      `select d.amount ,d.created_at, c.cause_name from donations d, causes c where d.user_id = $1 and c.cause_id = d.cause_id`,
      [req.user.user_id]
    )

    res.status(200).json({
      status: 'success',
      data: data.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}