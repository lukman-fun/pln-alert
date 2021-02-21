const moment = require("moment");

module.exports = {
    getJadwal: (con)=>{
        return new Promise((resolve, reject)=>{
            con.query(`SELECT jadwal_laporan.*, laporan.unit_layanan, laporan.jenis_laporan, pengaturan.nomor_handphone FROM jadwal_laporan INNER JOIN laporan ON laporan.id_laporan=jadwal_laporan.id_laporan INNER JOIN pengaturan ON jadwal_laporan.level=pengaturan.role WHERE DATE(waktu)='${moment().format("YYYY-MM-DD")}' AND HOUR(waktu)='${moment().format("HH")}' AND MINUTE(waktu)='${moment().format("mm")}' AND jadwal_laporan.status='0' ORDER BY id_jadwal_laporan ASC`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    },

    updateJadwal: (con, id)=>{
        return new Promise((resolve, reject)=>{
            con.query(`UPDATE jadwal_laporan SET status='1' WHERE id_jadwal_laporan='${id}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    },

    updateLaporan: (con, id, level)=>{
        return new Promise((resolve, reject)=>{
            const upRec=["00:30:00", "00:45:00", "01:00:00"];
            const resRec=moment().format("YYYY-MM-DD")+" "+upRec[level-1];
            con.query(`UPDATE laporan SET status='${level}', update_at='${resRec}' WHERE id_laporan='${id}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
            // con.query(`UPDATE laporan SET status='${level}', update_at='${moment().format("YYYY-MM-DD HH:mm:ss")}' WHERE id_laporan='${id}'`, (err, res)=>{
            //     if(err) reject(err);
            //     resolve(res);
            // });
        });
    }
}