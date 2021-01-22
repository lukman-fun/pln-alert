require("dotenv").config();
const base_url = process.env.BASE_URL;

module.exports = {
    index: (req, res)=>{
        if(!req.session.sesi){
            res.redirect("/Auth");
        }else{
            res.render("pengaturan/qrcode", {
                base_url,
                title: "PLN ALERT | Whatsapp"
            });
        }
    }
}