const table="role";

module.exports = {

    get: (con)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT * FROM ${table} ORDER BY level ASC`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
    
}