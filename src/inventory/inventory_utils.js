

const loki_db_data_keys_blacklist=[
    "$loki",
    "meta",
    "key"
]

const filter_db_data_from_result=(result_obj)=>{
    return Object.keys(result_obj).reduce((obj,key)=>{
        if (loki_db_data_keys_blacklist.includes(key)) return obj;
        return {...obj,[key]:result_obj[key]}
    },{})
}

const result_set_to_list=(result_set)=>{
    return result_set.data().map(m=>filter_db_data_from_result(m));
}

const result_list_to_csv =(inventory)=>{

        // console.log(inventory);

        let csv_prefix = "data:text/csv;charset=utf-8,";

        if (inventory.length==0) return;
        let csv_str = '';
        let header=Object.keys(inventory[0]).reduce((str,key)=>str+key+'\t',"")+"\n"
        let data = inventory.reduce((str,part)=>{
            return str+Object.values(part).reduce((str,val)=>str+val+'\t',"")+"\n"
        },"")

        let csv = csv_prefix + header + data;
        return csv;
}

export {
    
    result_set_to_list,
    result_list_to_csv

}