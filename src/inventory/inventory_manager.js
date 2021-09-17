


import { SubscriptionManager } from "../common/subscription_manager";
const loki = require('lokijs');

const get_part_key_from_part_data=(part_data)=>{
    const {manufacturer,part_name,part_number}={...part_data};
    return `${manufacturer}-${part_number}` 
}

const EVENTS={
    PART_ADDED:"PART_ADDED",
    PART_DELETED:"PART_DELETED",
    PART_UPDATED:"PART_UPDATED",
}

const HPF_DB_CONFIG ={
    AUTOSAVE_INTERVAL:4000
}


const create_date = ()=>{
    return new Date(Date.now()).toLocaleDateString();
}

var mock_records = ()=>{
    for (let i=0; i<20; i++){
        const fake_part_data = {
            part_name:`BOLT, FLANGE ${i}`,
            manufacturer:"Honda",
            part_number:`975701-08085-${i}`,
        }
        inventory_manager.insert(fake_part_data)
    }
}

class InventoryManager extends SubscriptionManager{

    constructor(){
        
        super();
        this.db = new loki("hpi_parts.db", {
            autoload: false,
            autoloadCallback : this.init,
            autosave: false, 
            autosaveInterval: HPF_DB_CONFIG.AUTOSAVE_INTERVAL
        });
        
        this.events=EVENTS;
    }

    init = ()=>{
        if (!this.db.getCollection("parts")) {
            this.db.addCollection("parts");
        }
        this.parts = this.db.getCollection("parts");
        mock_records();
    }

    insert=(part_data)=>{
        const key = get_part_key_from_part_data(part_data);

        const record = this.get_part_data(key);

        if (record){
            const {quantity}= {...record}
            this.parts.update({...record,quantity:quantity+1})
            this._emit(EVENTS.PART_UPDATED,record);
            return;
        }

        const to_insert = {
            ...part_data, 
            date_added:create_date(),
            key:get_part_key_from_part_data(part_data),
            quantity:1,
        };
        this.parts.insert(to_insert);
        this._emit(EVENTS.PART_ADDED,to_insert);

    }


    get_num_records = ()=>{
        return this.parts.data.length;
    }

    all=()=>{
        return this.parts.chain();
    }

    get_part_data=(part_key)=>{
        return this.parts.findOne({key:part_key})
    }

    sort_all_by=(key,reverse=false)=>{
        return this.sort_by(this.parts.chain(),key,reverse);
    }

    sort_by=(results,key,reverse=false)=>{
        
        const sort =(obj1,obj2)=>{
            let a,b;
            if (key=="date_added"){
                [a,b] = [obj1.meta.created,obj2.meta.created]
            }
            else{
                [a,b]=[obj1[key],obj2[key]]
            }
            // return sort_with_rev(a,b);
            if (a>b) return reverse ? 1 : -1;
            else if (a<b) return reverse ? -1: 1;
            return 0;
        }

        const new_results = results.branch();
        return new_results.sort(sort);

    }

    search = (results,key)=>{
        
        const query_funct_fact = (key) => (obj)=>{
            // return true;
            const fields = [obj.part_name,obj.manufacturer,obj.part_number,obj.date_added]
            return fields.reduce((prev,current)=>{
                return prev || obj.part_name.toLowerCase().includes(key.toLowerCase())
            },false);
        }
        const query_func = query_funct_fact(key);

        return results.where(query_func);
    }

    edit = (part_key,new_part_data)=>{
        const record = this.parts.findOne({key:part_key});
        if (record==null) throw "Attempt to update invalid record"
        record={...record,new_part_data}
        this.parts.update(record);
        this._emit(EVENTS.PART_UPDATED,part_key)
    }

    delete =(part_key)=>{
        const record = this.parts.findOne({key:part_key});
        if (record==null) throw "Attempt to update invalid record"
        this.parts.remove(record);
        this._emit(EVENTS.PART_REMOVED,part_key)
    }

}



const inventory_manager = new InventoryManager();
inventory_manager.init();

export default inventory_manager;
