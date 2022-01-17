const { pool } = require('../database')
const multer = require('multer')

exports.getAllBlogs = async (req, res) => {

  try {
    let blogs = await pool.query(`
    SELECT * FROM blogs order by blog_id desc;
`)

    res.status(200).json({
      status: 'Success',
      data: blogs.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

}



exports.getBlog = async (req, res) => {
  try {

    let blog = await pool.query(
      `select * from blogs where blog_id = ($1)` , 
      [req.params.id]
      )

      if(blog.rows.length===0)
        return  res.status(400).json({
          status: 'Success',
          message:'No blogs found'
        })

    res.status(200).json({
      status: 'Success',
      data: blog.rows
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/blog')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.mimetype.split('/')[1])
  }
})

const upload = multer({ storage: storage }).single('blogImage')

exports.createBlog = async (req, res) => {

  upload(req,res,async(err)=>{

  try {
    let { title, content } = req.body
    let image = req.file.filename

    let data = await pool.query(`
    INSERT INTO blogs (title , content,image) VALUES($1,$2,$3) returning *;`,
      [title, content, image]
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

})

}

exports.deleteBlog = async (req, res) => {

  try {

   let data =  await pool.query(`
    DELETE FROM blogs where blog_id =($1)`,
      [req.params.id]
    )

   if(data.rowCount==0)
      return res.status(400).json({
        status: 'Fail',
        message: 'No blog found'
      })

    res.status(200).json({
      status: 'success',
      message: 'blog deleted successfully'
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

}