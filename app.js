const { Client } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const moment=require('moment');
// const methodOverride = require("method-override");
const db = require('./config/db.js');
const fs = require('fs');
const cron = require("node-cron");
const { numberToWa } = require("./library/wa-number");
const excel = require("exceljs");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const session = require("express-session");





// Setter
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');
hbs.registerHelper("datetime", (datetime, format)=>{
    return moment(datetime).format(format);
});
hbs.registerHelper("ind", (value, same)=>{
    return value==same;
});
hbs.registerHelper("urut", (value)=>{
    return value+1;
});
hbs.registerHelper("wa_sesi",()=>{
    if (fs.existsSync('./wabot-session.json')) {
        return true;
    }else{
        return false;
    }
});

// Uses
app.use('/assets',express.static(__dirname+'/public'));
app.use(bodyParser.json());
// app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded(({ extended: true })));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next)=>{
    req.con = db;
    next();
});

//Use Router
app.use("/", require("./routes/LaporanRouter"));
app.use("/pengaturan", require("./routes/PengaturanRouter"));
app.use("/Whatsapp", require("./routes/WARouter"));
app.use("/Auth", require("./routes/AuthRouter"));

// const jadwal_laporan = require("./models/JadwalLaporan");


// app.get("/up", async (req, res)=>{
//    try {
//     const model = require("./models/CronLaporan");
//     const dt = await model.getJadwal(db);
//     dt.forEach(async (item, index)=>{
//         console.log("Level : "+item.level+", Nomor : "+item.nomor_handphone);
//         await model.updateJadwal(db, item.id_jadwal_laporan);
//         await model.updateLaporan(db, item.id_laporan, item.level);
//         console.log("Selesai");
//     });
//    }catch(err) {
//        console.log(err);
//    }
// });


// Session
const SESSION_FILE_PATH = './wabot-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu'
      ],
    },
    session: sessionCfg
  });

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
io.on('connection',(socket)=>{
    socket.emit('msg','⦿ Connecting...');
    socket.emit('status','0');

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        // console.log('QR RECEIVED', qr);
        qrcode.toDataURL(qr,(err, url)=>{
            socket.emit('qrcode',url);
            socket.emit('msg','⦿ QR Code Loaded');
            socket.emit('status','0');
        });
    });

    client.on('authenticated', (session) => {
        // console.log('AUTHENTICATED', session);
        console.log(session);
        socket.emit('msg','⦿ Whatsapp Is Auth');
        sessionCfg=session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.error(err);
            }
        });
    });

    client.on('ready', () => {
        // console.log('Client is ready!');
        socket.emit('msg','⦿ Whatsapp Ready');
        socket.emit('status','1');
        cron.schedule("* * * * *", ()=>{
            (async()=>{
                try {
                    const model = require("./models/CronLaporan");
                    const d = await model.getJadwal(db);
                    d.forEach(async (item, index)=>{
                        const levelWaktu=["30 menit", "45 menit", "60 menit"];
                        const number = numberToWa(item.nomor_handphone);
                        const msg = "Issue : 1 Pelanggan "+item.jenis_laporan+" selama lebih dari "+levelWaktu[item.level-1]+
                        "\nULP : "+item.unit_layanan+
                        "\nUP3 : UP3 Timika";
                        await model.updateJadwal(db, item.id_jadwal_laporan);
                        await model.updateLaporan(db, item.id_laporan, item.level);
                        
        
                        const terdaftar = await client.isRegisteredUser(number);
                        if(!terdaftar){
                            return res.status(404).json({
                                status: 404,
                                data: "The nummber not registered"
                            });
                            console.log("Nomor Tidak Terdaftar");
                        }
        
                        client.sendMessage(number, msg).then(response=>{
                            res.status(200).json({
                                status: 200,
                                data: response
                            });
                            console.log("Berhasil");
                        }).catch(err=>{
                            res.status(404).json({
                                status: 404,
                                data: err
                            });
                            console.log("Gagal");
                        });
                    });
                }catch(err) {
                    console.log(err);
                }
            })();
        });
    });

    client.on('auth_failure', function(session) {
        socket.emit('msg', '⦿ Auth failure, restarting...');
        socket.emit('status','0');
      });
    
    client.on('disconnected', (reason) => {
    socket.emit('msg', '⦿ Whatsapp is disconnected!');
    socket.emit('status','0');
    fs.unlinkSync(SESSION_FILE_PATH, function(err) {
        if(err) return console.log(err);
        console.log('Session file deleted!');
    });
    client.destroy();
    client.initialize();
    });
});

// app.post('/send_pesan', async (req, res)=>{
//     const number = numberToWa(req.body.tujuan);
//     const msg = req.body.msg;

//     const terdaftar = await client.isRegisteredUser(number);
//     if(!terdaftar){
//         return res.status(404).json({
//             status: 404,
//             data: "The nummber not registered"
//         });
//     }

//     client.sendMessage(number, msg).then(response=>{
//         res.status(200).json({
//             status: 200,
//             data: response
//         });
//     }).catch(err=>{
//         res.status(404).json({
//             status: 404,
//             data: err
//         });
//     });
// });

app.get("/Whatsapp/logout", (req, res)=>{
    if(!req.session.sesi){
        res.redirect("/Auth/login");
    }else{
        fs.unlinkSync(SESSION_FILE_PATH, function(err) {
            if(err) return console.log(err);
            console.log('Session file deleted!');
        });
        client.destroy();
        client.initialize();
        res.redirect("/Whatsapp");
    }
});

app.get("/excel", (req, res)=>{
    let workbook =new excel.Workbook();
    let worksheet =workbook.addWorksheet("Node Excel");
    worksheet.columns=[
        {header:"Title", key:"title", width:10},
        {header:"Content", key:"content", width:25},
        {header:"Deskripsi", key:"deskripsi", width:25},
    ];

    worksheet.addRows([
        {title: "Berita", content: "Hai1", deskripsi: "kduudgusgdodoidoiga"},
        {title: "Berita", content: "Hai2", deskripsi: "lnlan"},
        {title: "Berita", content: "Hai3", deskripsi: "kduudgusgdodjsdbboidoiga"},
        {title: "Berita", content: "Hai4", deskripsi: "qeeqeqeqe"},
        {title: "Berita", content: "Hai5", deskripsi: "uciuagiua"},
        {title: "Berita", content: "Hai6", deskripsi: "bcabuibdiuw"},
    ]);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tutorials.xlsx"
      );
    
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
        console.log("Berhasil");
      });
});


// app.get('/login',(req, res)=>{
//     res.render("login");
// });


server.listen(3030,()=>{
    console.log('connect http://localhost:3030');
});