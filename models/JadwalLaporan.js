const moment = require("moment");
const table="jadwal_laporan";

module.exports = {
    jadwal_today: (con)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT * FROM ${table} WHERE DATE(waktu)='${moment().format("YYYY-MM-DD")}' AND HOUR(waktu)='${moment().format("HH")}' AND MINUTE(waktu)='${moment().format("mm")}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    },

    store: (con, data)=>{
        return new Promise((resolve, reject)=>{
            con.query(`INSERT INTO ${table}(id_laporan, waktu, level, status) VALUES('${data.id_laporan}', '${data.waktu}', '${data.level}', '${data.status}')`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
}