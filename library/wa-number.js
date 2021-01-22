module.exports = {
    numberToWa: (number)=>{
        let format=number.replace(/\D/g, "");

        if(format.startsWith("0")){
            format="62"+format.substr(1);
        }

        if(!format.endsWith("@c.us")){
            format+="@c.us";
        }

        return format;
    }
}