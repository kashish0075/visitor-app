

const Day = function getDay(){
    var today = new Date().getDay();
    var day = "";
    switch(today){
        case 0:
         day = "Sunday";
         break;
         case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thrusday";
            break;  
        case 5:
            day = "Friday";
            break; 
        case 6:
            day = "Saturday";
            break;
    }

    return day;
}


module.exports = Day;