require("dotenv").config();
const base_url = process.env.BASE_URL;
const model = require("../models/Laporan");
const jadwal_laporan = require("../models/JadwalLaporan");
const jenis_laporan = require("../models/JenisLaporan");
const unit_layanan = require("../models/UnitLayanan");
const moment = require("moment");
const excel = require("exceljs");

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

    get_mon: async(req, res)=>{
        try{
            const alldata=await model.get(req.con, "open");
            return res.status(202).json(alldata)
        }catch(err){
            console.log(err);
        }
    },

    up_mon: async(req, res)=>{
        try{
            req.con.query(`UPDATE laporan SET update_at='${req.body.rectime}' WHERE id_laporan='${req.params.id}' `, (err1, resp1)=>{
                if(err1){
                    return res.status(404).json(err1)
                }else{
                    req.con.query(`SELECT * FROM laporan WHERE id_laporan='${req.params.id}'`, (err2, resp2)=>{
                        if(err2){
                            return res.status(404).json(err2)
                        }else{
                            return res.status(200).json(resp2)
                        }
                    });
                }
            });
        }catch(err){
            console.log(err);
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
    },

    laporan_to_excel: (req, res)=>{
        (async()=>{
            const namafile=req.params.nama+" "+moment().format("YYYYMMMDD HHmmss");
            const alldata=await model.get(req.con, req.params.nama.toLowerCase()=="monitoring_laporan" ? "open" : "close");
            let workbook =new excel.Workbook();
            let worksheet =workbook.addWorksheet(namafile);
            worksheet.columns=[
                {header:"UNIT LAYANAN", key:"unit_layanan", width:30},
                {header:"WAKTU LAPORAN", key:"create_at", width:30},
                {header:"NAMA PELANGGAN", key:"nama_pelanggan", width:30},
                {header:"NO. HANDPHONE", key:"nomor_handphone", width:30},
                {header:"JENIS LAPORAN", key:"jenis_laporan", width:30},
                {header:"RECOVERY TIME", key:"update_at", width:30},
                {header:"STATUS", key:"status", width:30}
            ];

            // worksheet.addRows([
            //     {title: "Berita", content: "Hai1", deskripsi: "kduudgusgdodoidoiga"},
            //     {title: "Berita", content: "Hai2", deskripsi: "lnlan"},
            //     {title: "Berita", content: "Hai3", deskripsi: "kduudgusgdodjsdbboidoiga"},
            //     {title: "Berita", content: "Hai4", deskripsi: "qeeqeqeqe"},
            //     {title: "Berita", content: "Hai5", deskripsi: "uciuagiua"},
            //     {title: "Berita", content: "Hai6", deskripsi: "bcabuibdiuw"},
            // ]);
            const levelWaktu=["OPEN < 30 menit", "OPEN > 30 menit", "OPEN > 45 menit", "OPEN > 60 menit", "CLOSE"];
            let newdata=[];
            await alldata.forEach((item, index)=>{
                item.status=levelWaktu[item.status=="200" ? 4 : item.status];
                newdata[index]=item;
            });
            worksheet.addRows(newdata);

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename="+namafile+".xlsx"
            );
            
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
                console.log("Berhasil");
            });
        })();
    }
    
}