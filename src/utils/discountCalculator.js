export function discountCalculator(sellingPrice , mrp){

    return Math.ceil(((mrp - sellingPrice)/sellingPrice)*100)
}