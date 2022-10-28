import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

var connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    charset: "UTF8MB4_GENERAL_CI"
});

function insertToDatabase(db, newCustomer){
//  console.log(newCustomer)
  connection.query(`INSERT INTO ${db} SET ?`, newCustomer, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
  });
}
export default insertToDatabase;