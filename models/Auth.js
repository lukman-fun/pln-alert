const table = "akun";

module.exports = {
    login: (con, data)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT * FROM ${table} WHERE email='${data.email}' AND password='${data.password}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
}