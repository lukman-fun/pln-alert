const table="jenis_laporan";

module.exports = {
    get: (con)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT* FROM ${table} ORDER BY id_jenis_laporan ASC`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
}