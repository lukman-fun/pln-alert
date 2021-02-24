const table="laporan"

module.exports = {
    get: (con, status)=>{
        let sql=null;
        if(status=="close"){
            sql=`SELECT * FROM ${table} WHERE status='200' ORDER BY id_laporan DESC`;
        }else{
            sql=`SELECT * FROM ${table} WHERE status!='200' ORDER BY id_laporan DESC`;
        }

        return new Promise((resolve, reject)=>{
            con.query(sql, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    },

    store: (con, data)=>{
        return new Promise((resolve, reject)=>{
            // const resRec=data.waktu_laporan.split(" ")[0]+" 00:00:00"
            con.query(`INSERT INTO ${table}(nama_pelanggan, alamat_pelanggan, nomor_handphone, unit_layanan, jenis_laporan, create_at, update_at) VALUES('${data.nama_pelanggan}', '${data.alamat_pelanggan}', '${data.nomor_handphone}', '${data.unit_layanan}', '${data.jenis_laporan}', '${data.waktu_laporan}', '00:00:00')`, (err, res)=>{
                if(err) reject(err);
                resolve(res.insertId);
            });
        });
    },

    close: (con, id)=>{ 
        return new Promise((resolve, reject)=>{
            con.query(`UPDATE laporan SET status='200' WHERE id_laporan='${id}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
            // const date=require("../library/waktu");
            // con.query(`UPDATE laporan SET update_at='${date.date_time}', status='200' WHERE id_laporan='${id}'`, (err, res)=>{
            //     if(err) reject(err);
            //     resolve(res);
            // });
        });
    },

    delete_jadwal: (con, id)=>{
        return new Promise((resolve, reject)=>{
            con.query(`DELETE FROM jadwal_laporan WHERE id_laporan='${id}'`, (err, res)=>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
}