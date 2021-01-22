require("dotenv").config();
const base_url = process.env.BASE_URL
const model = require("../models/Pengaturan");
const m_role = require("../models/Role");

module.exports = {
    index: (req, res)=>{
        if(!req.session.sesi){
            res.redirect("/Auth");
        }else{
            (async()=>{
                try{
                    const alldata=await model.get(req.con);
                    const roledata=await m_role.get(req.con);
                    res.render("pengaturan/pengaturan",{
                        base_url,
                        data: alldata,
                        role: roledata,
                        title: "PLN ALERT | Pengaturan"
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
                await model.store(req.con, req.body);
                res.redirect("/Pengaturan");
            } catch (err) {
                console.log(err);
            }
        })();
    },

    update: (req, res)=>{
        (async()=>{
            try {
                await model.update(req.con, req.body, req.body.id_pengaturan);
                res.redirect("/Pengaturan");
            } catch (err) {
                console.log(err);
            }
        })();
    },

    delete: (req,res)=>{
        (async()=>{
            try {
                await model.delete(req.con, req.params.id);
                res.redirect("/Pengaturan")
            } catch (err) {
                console.log(err);
            }
        })();
    }
}