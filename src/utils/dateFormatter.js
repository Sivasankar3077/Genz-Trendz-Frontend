export function dateFormatter(inputDate){
    const dt = new Date(inputDate);
    return dt.toLocaleDateString('en-IN' ,{
        day : "2-digit",
        month : 'short',
        year : "numeric"
    })
}