const {Pool} = require('pg')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "charity",
    password: "admin",
    port: 5432
  })
  
 async function createTables (){

    await pool.query(`create table if not exists users(
    user_id serial primary key,
    email varchar(50)  not null unique,
    phone varchar(15) unique not null,
    role varchar(7) default 'user' check (role in ('admin','user','volunteer')),
    password varchar(1000) not null ,
    passwordHashed varchar(20000) not null);`
    ).then(()=>console.log('user db created successfully')) 

    await pool.query(`create table if not exists causes(
        cause_id serial primary key,
        cause_name varchar(30) not null unique,
        cause_description varchar(500) not null );`
        
        ).then(()=>console.log('cause table created successfully'))

    await pool.query(`create table if not exists blogs(
        blog_id serial primary key,
        title varchar(30) not null,
        content varchar(2000) not null,
        image varchar(40) );
    `
    ).then(()=>console.log('blog db created successfully'))

    await pool.query(`create table if not exists donations (
        donation_id serial primary key ,
        cause_id int references causes(cause_id) ON DELETE CASCADE,
        user_id int references users(user_id) ON DELETE CASCADE);`
        ).then(()=>console.log('donation db created successfully'))


    await pool.query(`create table if not exists contacts(
            contact_id serial primary key,
            message varchar(1000) not null ,
            name varchar(20) not null,
            email varchar(100) not null);   
        `).then(()=>console.log('contact table created successfully'))

    }

module.exports = {
    pool,
    createTables
}