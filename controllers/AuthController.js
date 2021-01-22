require("dotenv").config();
const base_url = process.env.BASE_URL;
const model = require("../models/Auth");

module.exports = {
    login: (req, res)=>{
        if(req.session.sesi){
            res.redirect("/");
        }else{
            res.render("login", {
                base_url
            });
        }
    },
    actLogin: (req, res)=>{
        (async()=>{
            const data = await model.login(req.con, req.body);
            if(data.length>0){
                req.session.sesi=true;
                req.session.data=data;
                res.redirect("/");
            }else{
                res.redirect("/Auth/login");
            }
        })();
    },
    logout: (req, res)=>{
        req.session.sesi=false;
        req.session.data=null;
        res.redirect("/Auth");
    }
}