const table="unit_layanan";

module.exports = {
    get: (con)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT* FROM ${table} ORDER BY id_unit_layanan ASC`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
}