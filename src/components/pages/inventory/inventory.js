
import { HPFPageContainer,HPFPageTitle } from "../../general/page/hpf_page"
import { useEffect, useRef, useState } from "react";

import {VSpacer} from '../../general/spacer.js'
import './style/inventory_style.scss'
import { result_set_to_list,result_list_to_csv } from "../../../inventory/inventory_utils";
import { useMediaQuery } from 'react-responsive'

import inventory_manager from "../../../inventory/inventory_manager";
import classNames from "classnames";
import DownloadIcon from '../../general/svg/download'
const table_config ={
    rows:[
        {title:"Name",key:"part_name", width:"20%"},
        {title:"Part number",key:"part_number",width:"20%"},
        {title:"Manufacturer",key:"manufacturer",width:"20%"},
        {title:"Date added",key:"date_added",width:"10%"},
        {title:"Quantity",key:"quantity",align:"right",width:"10%"},
    ]
}
const HPFInventoryTable=(props)=>{

    const {items,onHeaderClick}={...props};

    return (
        <div className="table_container">
        <div className="table_overlay">
            <div className="hpf_table_fade"/>
        </div>
        <table className="hpf_table header_fixed">
                <colgroup>
                {table_config.rows.map((row,key)=>(
                    <col key={key} width = {row.width}/>
                ))}
                </colgroup>
                <tbody>
                <tr className="hpf_table_header">
                    {table_config.rows.map((row,key)=>(
                        <th key={key}
                            className={classNames({ar:row.align=="right"})}
                            onClick={()=>{onHeaderClick(row.key)}}
                        >
                            {row.title}
                        </th>
                    ))}
                </tr>
                </tbody>
        </table>
        <div className="table_scroll_container">
        <div className="table_scroll_area">
        <table className="hpf_table">

                <colgroup>
                {table_config.rows.map((row,key)=>(
                    <col key={key} width = {row.width}/>
                ))}
                </colgroup>
                <tbody>
        
                {
                    items.map(((item,key)=>(

                    <tr key={key} className="hpf_table_row">
                        {table_config.rows.map((row,key)=>(
                            <td key={key} className={classNames({ar:row.align=="right"})}>
                                <span>
                                {item[row.key]}
                                </span>
                            </td>
                        ))}
                    </tr>
                    )))
                }

                {/* <tr className="hpf_table_row">
                        {table_config.rows.map((row,key)=>(
                            <td key={key} className={classNames({ar:row.align=="right"})}>
                                <span>
                                &nbsp;
                                </span>
                            </td>
                        ))}
                </tr> */}

            </tbody>
            </table>
            </div>
            </div>

            </div>
    )
}

const InventoryItemMobile=(props)=>{

    const {part_name,manufacturer,date_added,part_number} ={...props.part}

    return(
        <button className="inventory_item_mobile_container">
        <div className="inventory_item_mobile_text_desc">
            <span>{ `${manufacturer} - ${part_number}` }</span>
            <span>{date_added}</span>
        </div>
        <div className="inventory_item_mobile_title">
            {part_name}
        </div>
       </button>
    )
}

const HPFInventoryMobile = (props)=>{
    const {items} = {...props}
    return (
        <div className="inventory_mobile_container">
   
        {items.map((item,key)=>(
            <span key={key}>
            <InventoryItemMobile part = {item}/>
            <VSpacer height={"10px"}/>
            </span>
        ))}

        </div>
    )
}

const fakeData=()=>{
    let test=[]
    for (let i=0; i<1000; i++){
        test.push({
            part_name:"BOLT, FLANGE (8x85)",
            manufacturer:"HONDA",
            part_number:"95701-08085-00",
            date_added:"9/3/21"
        })
    }
    return test;
}

const InventoryOptions=(props)=>{

    const {onSearch,onDownloadRequest} = {...props}

    return (
        <div className="inventory_options_container">
        <input onChange ={onSearch} placeholder ="filter" type ="text" className="hpf_search_bar"/>
        <button onClick={onDownloadRequest}
            className="hpf_download_csv_button">
            <DownloadIcon className="download_svg" color ={"#aaa"}/>
        </button>

        </div>
    )
}

const DesktopHeader=(props)=>{
    const {search,download} = {...props.actions}
    return(
        <>
        <div className="hpf_inventory_top_results">
        <HPFPageTitle title ="My inventory"/>
        <VSpacer height="20px"/>
        <InventoryOptions onSearch={search} onDownloadRequest={download}/>
        </div>
        <VSpacer height="20px"/>
        </>
    )
}


const MobileHeader=(props)=>{
    const {search,download} = {...props.actions}
    return(
        <div className="hpf_inventory_mobile_header">
            <HPFPageTitle title = "Inventory"/>
            <VSpacer height="15px"/>
            <InventoryOptions onSearch={search} onDownloadRequest={download}/>
        </div>
    )
}

const fake_results = fakeData();

const NPP=20;

const default_sort_key = "date_added"



const InventoryPage = ()=>{

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 500px)' })

    const [results,setResults]= useState(null);

    const [page,setPage]= useState(0);
    const num_results_total = inventory_manager.get_num_records();
    const num_pages = Math.ceil(num_results_total / NPP)

    const sort_data = useRef([default_sort_key,false]);

    const get_page=(results,page_num)=>{
        return results.slice(page_num*NPP,page_num*NPP+NPP);
    }

    const next = ()=>{
        setPage(page+1)
    }
    
    const prev = ()=>{
        setPage(page-1)
    }

    const download_as_csv = ()=>{

        let inventory = result_set_to_list(inventory_manager.all());
        let csv=result_list_to_csv(inventory);

        console.log(csv);

        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
            
    }

    const search = (event)=>{

        let [current_sort_key, reversed] = sort_data.current;
        const key = event.target.value
        console.log(event)
        let res = inventory_manager.search(inventory_manager.all(),key);
        res = inventory_manager.sort_by(res,current_sort_key,reversed);
        
        setResults(res);

    }

    const sort=(key)=>{
        let [current_sort_key, reversed] = sort_data.current;
        if (current_sort_key==key){
            reversed =!reversed;
        }
        else{
            reversed=false;
        }
        setResults(inventory_manager.sort_by(results,key,reversed))
        sort_data.current = [key,reversed];
        setPage(0);
    }

    useEffect(()=>{
        isTabletOrMobile ? 
            setResults(inventory_manager.sort_all_by(default_sort_key)) 
                : 
            setResults(inventory_manager.sort_all_by(default_sort_key))
    },[])

    const actions ={
        search:search,
        download:download_as_csv
    }

    const items = results == null ? [] : result_set_to_list(results);

    return (
        <HPFPageContainer>
            <div className="hpf_inv_container">

            <div className="container">

            {isTabletOrMobile ? 
                <MobileHeader actions={actions}/> : 
                <DesktopHeader actions={actions}/>
            }
         
            {
                isTabletOrMobile ? 
                    <HPFInventoryMobile items={items}/> : 
                    <HPFInventoryTable onHeaderClick={sort} items={get_page(items,page)}/>
                 
            }

            </div>
          
           {isTabletOrMobile ? null : 
            <>
                {/* <VSpacer height={"40px"}/> */}
                {/* <HPFInventoryPaginator 
                    next={next} 
                    prev={prev}
                    hasNext={page!=num_pages-1}
                    hasPrev={page!=0}
                /> */}
            </>
            }
        </div>
        </HPFPageContainer>
    )

}

export default InventoryPage;