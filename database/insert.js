import Sql from "./db.js";

function updateUser(id, customer,){
  Sql.query(`INSERT INTO lastseen (user_login, channel, date, watchtime, offlinetime, points) VALUES(?, ?, ?, 1, 1, 10) ON DUPLICATE KEY UPDATE date = VALUES(date)
  ${customer.watchtime === true ? ", watchtime = watchtime+1, points = points+10": ", offlinetime = offlinetime+1"}`, 
  [id, customer.channel, customer.date], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      //console.log(res)

      return {status: 200, message: "updated"};
  });
}
export default updateUser;