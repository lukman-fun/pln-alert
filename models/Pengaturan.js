const table="pengaturan";

module.exports = {
    get: (con)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT * FROM ${table} INNER JOIN role ON pengaturan.role=role.level ORDER BY id_pengaturan DESC`, (err, res)=>{
                if(err) reject(err);
                    resolve(res);
            });
        });
    },

    getById: (con, id)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT * FROM ${table} WHERE id_pengaturan='${id}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    },

    store: (con, data)=>{
        return new Promise((resolve, reject)=>{
            con.query(`INSERT INTO ${table}(nomor_handphone, nama, role) VALUES('${data.nomor_handphone}', '${data.nama}', '${data.role}')`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    },

    update: (con, data, id)=>{
        return new Promise((resolve, reject)=>{
            con.query(`UPDATE ${table} SET nomor_handphone='${data.nomor_handphone}', nama='${data.nama}', role='${data.role}' WHERE id_pengaturan='${id}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    },

    delete: (con, id)=>{
        return new Promise((resolve, reject)=>{
            con.query(`DELETE FROM ${table} WHERE id_pengaturan='${id}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
}