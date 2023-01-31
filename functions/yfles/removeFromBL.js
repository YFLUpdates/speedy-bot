import Sql from "../../database/db.js";

export default async function request(user){
    return Sql.query(`DELETE FROM blacklist WHERE user_login=${user}`, (err, res) => {
        if (err) {
          //console.log(err);
          return null;
        }
        //console.log(res)
  
        return {status: 200, message: "deleted"};
    });
}