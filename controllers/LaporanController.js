require("dotenv").config();
const base_url = process.env.BASE_URL;
const model = require("../models/Laporan");
const jadwal_laporan = require("../models/JadwalLaporan");
const jenis_laporan = require("../models/JenisLaporan");
const unit_layanan = require("../models/UnitLayanan");
const moment = require("moment");

module.exports = {
    index: (req, res)=>{
        if(!req.session.sesi){
            res.redirect("/Auth");
        }else{
            (async()=>{
                try{
                    const laporan=await jenis_laporan.get(req.con);
                    const layanan=await unit_layanan.get(req.con);
                    res.render("laporan/input",{
                        base_url,
                        laporan,
                        layanan,
                        sesi: req.session.sesi,
                        title: "PLN ALERT | Input Laporan",
                        waktu: moment().format("YYYY-MM-DD HH:mm:ss")
                    });
                }catch(err){
                    console.log(err);
                }
            })();
        }
    },

    store: (req, res)=>{
        (async()=>{
            try {
                req.body.waktu_laporan=moment().format("YYYY-MM-DD HH:mm:ss");
                const id=await model.store(req.con, req.body);
                const jadwal = [
                    {
                        id_laporan: id,
                        waktu: moment(req.body.waktu_laporan).add(31, "m").format("YYYY-MM-DD HH:mm:ss"),
                        level: 1,
                        status: 0
                    },
                    {
                        id_laporan: id,
                        waktu: moment(req.body.waktu_laporan).add(46, "m").format("YYYY-MM-DD HH:mm:ss"),
                        level: 2,
                        status: 0
                    },
                    {
                        id_laporan: id,
                        waktu: moment(req.body.waktu_laporan).add(61, "m").format("YYYY-MM-DD HH:mm:ss"),
                        level: 3,
                        status: 0
                    }
                ];
                for(var i=0;i<jadwal.length;i++){
                    await jadwal_laporan.store(req.con, jadwal[i]);
                }
                res.redirect("/");
            } catch (err) {
                console.log(err);
            }
        })();
    },

    monitoring: (req, res)=>{
        if(!req.session.sesi){
            res.redirect("/Auth");
        }else{
            (async()=>{
                try {
                    const alldata=await model.get(req.con, "open");
                    res.render("laporan/monitoring", {
                        data: alldata,
                        title: "PLN ALERT | Monitoring Laporan",
                        base_url
                    });
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    },

    rekapitulasi: (req, res)=>{
        if(!req.session.sesi){
            res.redirect("/Auth");
        }else{
            (async()=>{
                try {
                    const alldata=await model.get(req.con, "close");
                    res.render("laporan/rekapitulasi", {
                        data: alldata,
                        title: "PLN ALERT | Rekapitulasi Laporan",
                        base_url
                    });
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    },

    laporan_close: (req, res)=>{
        (async()=>{
            await model.close(req.con, req.params.id);
            await model.delete_jadwal(req.con, req.params.id);
            res.redirect("/Monitoring_Laporan");
        })();
    }
    
}