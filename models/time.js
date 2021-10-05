

const time = function getTime(){
    let today = new Date();
    let time = "";
    let min = "";
    if(today.getMinutes() < 10)
      min = "0"+today.getMinutes();
    else
     min = today.getMinutes();

    if(today.getHours() > 12){
        time = (today.getHours() - 12) + ":" + min + "pm";
    }else{
        time = today.getHours() + ":" + min + "am";
    }
    
    return time;
}

module.exports = time;