const date_ob=new Date();

module.exports = {
    today: date_ob.getDate(),
    month: date_ob.getMonth()+1,
    year: date_ob.getFullYear(),
    hours: date_ob.getHours(),
    minutes: date_ob.getMinutes(),
    seconds: date_ob.getSeconds(),
    date: date_ob.getFullYear()+"-"+(date_ob.getMonth()+1)+"-"+date_ob.getDate(),
    time: date_ob.getHours()+":"+date_ob.getMinutes()+":"+date_ob.getSeconds(),
    date_time: date_ob.getFullYear()+"-"+(date_ob.getMonth()+1)+"-"+date_ob.getDate()+" "+date_ob.getHours()+":"+date_ob.getMinutes()+":"+date_ob.getSeconds(),
}

// Date
// const today=date.getDate();
// const month=date.getMonth()+1;
// const year=date.getFullYear();

// Time
// const hours=date.getHours();
// const minutes=date.getMinutes();
// const seconds=date.getSeconds();