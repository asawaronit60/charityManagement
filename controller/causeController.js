const { pool } = require('../database')
const multer = require('multer')
const sharp = require('sharp')

exports.getAllCauses = async (req, res) => {

  try {
    let causes = await pool.query(`
      SELECT * FROM causes ;
  `)

    res.status(200).json({
      status: 'Success',
      data: causes.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

}


exports.getCause = async (req, res) => {
  try {

    let cause = await pool.query(
      `select * from causes where cause_id = ($1)`,
      [req.params.id]
    )

    res.status(200).json({
      status: 'success',
      data: cause.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.file)
    cb(null, './public/img/causes')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
  }
})

const upload = multer({ storage: multerStorage }).single('causeImage')


exports.createCause = async (req, res) => {


  upload(req, res, async err => {

    try {

      let { cause_name, cause_description, cause_goal } = req.body
      let image = req.file.filename
  
      let data = await pool.query(`
          INSERT INTO causes (cause_name, cause_description,cause_image,goal ) VALUES($1,$2,$3,$4) returning *;`,
        [cause_name, cause_description, image, cause_goal],
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



  })//uploadds



}



exports.deleteCause = async (req, res) => {

  try {

    let data = await pool.query(`
      DELETE FROM causes where cause_id =($1)`,
      [req.params.id]
    )

    if (data.rowCount == 0)
      return res.status(400).json({
        status: 'Fail',
        message: 'No cause found'
      })

    res.status(200).json({
      status: 'success',
      message: 'cause deleted successfully'
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

}

exports.deleteAllCauses = async (req, res) => {
  try {

    let data = await pool.query(`TRUNCATE causes CASCADE`)

    if (data.rowCount == 0)
      return res.status(400).json({
        status: 'Fail',
        message: 'No cause found'
      })

    res.status(200).json({
      status: 'success',
      message: 'All causes deleted successfully'
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}


exports.getCauseDetails = async (req, res) => {
  try {

    let data = await pool.query(
      `select sum(d.amount) as total , c.cause_name from donations d , causes c 
       where d.cause_id = c.cause_id group by c.cause_id order by total desc `
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

exports.getTop3 = async (req, res) => {
  try {

    let data = await pool.query(
      `select sum(d.amount) as total , c.cause_name from donations d , causes c 
       where d.cause_id = c.cause_id group by c.cause_id order by total desc limit 3`
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