export class Utils {
    static doUrlEncode(url_obj){
        let query = '?';
        var i = 0;
        for (const key in url_obj) {
            if (Object.prototype.hasOwnProperty.call(url_obj, key)) {
                const element = url_obj[key];
                if(i == 0){
                    query += key+'='+element;
                }else{
                    query += '&'+key+'='+element;
                }
                i++; 
            }
        }
        return query;
    }
}