export const NumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const FormatMoney = (value) => {
    if (typeof (value) === 'string') {
        return Capitalize(value);
    }
    //console.log("FormatMoney",'$ ' + NumberWithCommas(value))
    return '$ ' + NumberWithCommas(value);
};

export const Capitalize = (value) => {
    return (value.charAt(0).toUpperCase() + value.slice(1));
}

export const FormatDateComplete = function (una_fecha) {
    const fecha = una_fecha == null ? new Date() : new Date(una_fecha + " UTC");
    const miFecha = fecha.getFullYear() + "-" + (((fecha.getMonth() + 1).toString().length == 1) ? "0" + (fecha.getMonth() + 1) : (fecha.getMonth() + 1)) + "-" + (((fecha.getDate()).toString().length == 1) ? "0" + (fecha.getDate()) : (fecha.getDate())) + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds() + "";
    return miFecha;
};
export const OdooDateToReact = (dateOdoo) => {
    const dateSplit = dateOdoo.split(" ")[0].split("-");
    const hourSplit = dateOdoo.split(" ")[1].split(":");
    return new Date(dateSplit[0], dateSplit[1], dateSplit[2], hourSplit[0], hourSplit[1], hourSplit[2]);
}

/**
 * Modifica una fecha para convertirla en un string sencillo con formato "dd-mm-yyyy".
 * @param date Una fecha de tipo date.
 * @param yearFirst Invierte el orden del formato a "yyyy-mmm-dd".
 * @param addDays Añadir dias a la fecha.
 * @param addMonths Añadir meses a la fecha".
 * @param addYears Añadir años a la fecha.
 * @return Un string con la fecha convertida.
*/
export const DateToString = (date, yearFirst = false, addDays = 0, addMonths = 0, addYears = 0) => {
    
    if (date && date.getDate) {
        date.setDate(date.getDate() + addDays);
        date.setMonth(date.getMonth() + addMonths);
        date.setFullYear(date.getFullYear() + addYears);
        
        
        if (yearFirst) {
            date = date.getFullYear() + "-" + (((date.getMonth() + 1).toString().length == 1) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (((date.getDate()).toString().length == 1) ? "0" + (date.getDate()) : (date.getDate()));
            
        } else {
            date = (((date.getDate()).toString().length == 1) ? "0" + (date.getDate()) : (date.getDate())) + "-" + (((date.getMonth() + 1).toString().length == 1) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear();
        
        }
        console.log("date del DateToString ",date)
        return date;
    } else {
        return "Error";
    }
    
}

