const INDEX_NOT_FOUND=-1


const findFuncByContents=(func_array,search_func)=>{
    const search_func_str=search_func.toString();
    return func_array.findIndex((func)=>{
        if (search_func.name!==func.name) return false;
        if (search_func_str===func.toString()) return true;
        return false
    })
}

class SubscriptionManager{

    _subscriptions={}

    subscribe=(event_name,handler,oneshot=false,call_with_event_id=false)=>{
        if (handler==undefined) return;
        if (this._subscriptions[event_name]==undefined) this._subscriptions[event_name]=[];
        if (typeof event_name=="string"){ 
            this._subscriptions[event_name]=[
                ...this._subscriptions[event_name],{
                    func:handler,
                    oneshot:oneshot,
                    call_with_event_id:call_with_event_id
                }
            ];
        }
    }

    subscribeMultiple=(event_names,handler,oneshot=false)=>{
        event_names.map((event_name,i)=>{
            this.subscribe(
                event_name,
                handler,
                oneshot,
                true
            )
        })
    }

    unsubscribeMultiple=(event_names,handler)=>{
        return event_names.reduce((successes,event_name,i)=>{
            return [...successes, this.unsubscribe(event_name,handler)]
        },[])
    }

    unsubscribe=(event_name,handler)=>{

        if (handler==undefined) return false;
        if (this._subscriptions[event_name]==undefined) return false;

        let index=this._subscriptions[event_name].findIndex(s=>(s.func==handler));
        
        if (index==INDEX_NOT_FOUND){
            const func_array=this._subscriptions[event_name].map(s=>s.func)
            index=findFuncByContents(func_array,handler)
        }
        
        const found=(index>INDEX_NOT_FOUND);
        if (found) this._subscriptions[event_name].splice(index,1);
        return found;

    }

    unsubscribeAll=(event_name)=>{

        if (event_name){
            this._subscriptions[event_name]=[];
            return;
        }
        this._subscriptions={};

    }

    _emit=(event_name,data)=>{
        // console.log(event_name,data)
        if (this._subscriptions[event_name]==undefined) return;
        this._subscriptions[event_name].forEach((subscription,index,subs)=>{
            
            subscription.func.apply(null,subscription.call_with_event_id ? [event_name,data] : [data])
            if (subscription.oneshot) subs.splice(index,1)
        });
        // for (callback of this._subscriptions[event_name]){
        //     callback(data)
        // }
    }

}

export {SubscriptionManager}