


import './style/add_parts_style.scss';

import {HPFToggleText,HPFToggle} from '../../general/toggle/toggle';
import {HPFLabel} from '../../general/labeled_component/labeled_component.js';
import { HPFPageTitle,HPFPageContainer, HPFPageDescription,HPFHiddenOnMobile } from '../../general/page/hpf_page';
import { VSpacer } from '../../general/spacer';
import Scanner from '../../scanner/scanner';
import classNames from 'classnames';
import { useState,useRef, useEffect } from 'react';
import { get_part_data } from '../../../api/api';
import uuid from 'uuid';


import { CSSTransitionGroup } from 'react-transition-group' // ES6

import inventory_manager from '../../../inventory/inventory_manager'; 

const AddPartsOptions=(props)=>{
    const {onVisionModeToggle,onModeToggle} = props;
    return (
        <div className="hpf_add_page_options_container">
            <div className="hpf_flexible_row">
                <HPFLabel title ="Entry type"/>
                <HPFLabel title ="Scanner vision"/>
            </div>
            <div className="hpf_flexible_row">
                <HPFToggleText 
                    options ={["Scan","Manual"]}
                    onToggle={onModeToggle}
                />
                <HPFToggle onToggle={onVisionModeToggle}/>

            </div>
        </div>
    )
}


const PartIndicator = (props) =>{

    const {status,part} = props;
    const {part_name,part_number,manufacturer} = {...part};

    const has_part = Object.keys(part).length!=0

    const part_title = (part_name==null) ? "UNKNOWN PART" : part_name

    return (
        <div className={classNames({
                hpf_part_indicator_container:true,
                recognized:status=="recognized",
                unsure: status == "unsure"
            })}>
            <div className="hpf_part_indicator_text_container">
                <div className="hpf_part_indicator_part_title">
                    {has_part ? part_title : "No part identified"}
                </div>

                <div className="hpf_part_indicator_subtext">
                    {has_part ? part_number :  "Ensure the part number is in view"}
                </div>
            </div>
        </div>
    )
}





const add_part_to_inventory=(part)=>{

    inventory_manager.insert(part);
}

const AddToInventoryButton=(props)=>{

    const {disabled,onClick}={...props}

    const [animating,setAnimating]=useState(false);

    // const onClick=()=>{
    //     inventory_manager.insert({
    //         part_name:"Test",
    //         manufacturer:"Honda",
    //         part_number:String(Math.random()).slice(2,9),
    //     })
    // }


    return (
        <button 
            disabled={disabled} 
            onClick={()=>{
                onClick?.()
                setAnimating(true);
            }}
            onAnimationEnd={()=>{
                setAnimating(false);
            }}
            className={classNames({
                hpf_ati_button:true,
                success:animating,
            })}>

            <span>Add to inventory</span>

        </button>
    )
}

const PartLink = (props)=>{
    const {title,isNone} = {...props};
    return (
        <li className={classNames({"hpf_partlink_container":true,no_recent:isNone})}>
            <div className="hpf_partlink_title">{isNone ? "No recently added parts" : title}</div>
        </li>
    )
}



const RecentlyAddedParts = (props) =>{

    const [parts, setParts] = useState([]);

    const has_parts = parts.length != 0;

    const on_new_part=(event_name,part)=>{
        setParts(parts=>[{...part,id:uuid()},...parts])
    }
    
    useEffect(()=>{
        inventory_manager.subscribeMultiple(
            [inventory_manager.events.PART_ADDED,
            inventory_manager.events.PART_UPDATED],
            on_new_part
        );
        return ()=>{
            inventory_manager.unsubscribeMultiple(
                [inventory_manager.events.PART_ADDED,
                inventory_manager.events.PART_UPDATED],
                on_new_part,
            )
        }
    },[])

    console.log(parts);

    const items =parts.map((part,i)=>{
        const title = part.part_name ? part.part_name : part.part_number;
        return <PartLink key={part.id} title = {title}/>
    })

    return (
        <div className="hpf_recent_parts_container">
           <div className="hpf_recent_title">Recently added</div>
           <ul className="hpf_recent_parts_list_container">
            {
                has_parts ? 
                  
                    items
                    : 
                    <PartLink key={-1} isNone={true}/>
            }
            </ul>
        </div>
    )
}


const AddPartsPage = ()=>{

    const initial_state={
        status:"unrecognized",
        part:{},
    }

    const [recognition_state,setRecognitionState]=useState(initial_state);
    const [vision_mode,setVisionMode]=useState(false);

    const timeout_ref = useRef(null);
    const scanner_ref = useRef(null);
    const status_ref = useRef(null); // for use in callback, just mirrors state.status

    const clear=()=>{
        status_ref.current=initial_state.status;
        setRecognitionState(initial_state);
        scanner_ref.current.setScannerBoxColor("#ddd")
    }

    const onDetect=async (part_number)=>{

        let response = await get_part_data(part_number);

        const data_found = response.data_found;

        const {manufacturer,title}={...response.data};

        const test_func=(current_state)=>{

            const timer = timeout_ref.current;

            if (!data_found && current_state.status=="recognized"){
                // no data, in unrecognized
                // console.log("here")
                scanner_ref.current.setScannerBoxColor("#ddd")
                return current_state;
            }
            else if (!data_found){
                // no data, in unsure or unrecognized
                if (timer) clearTimeout(timer);
                timeout_ref.current=setTimeout(clear, 3000)
            }
            else{
                // data found
                if (timer) clearTimeout(timer);
                timeout_ref.current=setTimeout(clear, 5000)
            }

            scanner_ref.current.setScannerBoxColor(
                data_found ? "#2ecc71" : "#f1c40f"
            );

            return {
                status: data_found ? "recognized" : "unsure",
                part:{
                    part_number:part_number,
                    part_name:title ? title :"UNTITLED PART",
                    manufacturer:"HONDA"// beta...
                }
            }
            
        }

        setRecognitionState(test_func)

    }

  
    const handleVisionMode=(mode)=>{
        const {current:scanner} = scanner_ref;
        scanner.setShowScannerVision(mode);
    }
    
    return (
        <HPFPageContainer>

            <div className="hpf_ap_split">
                <div className="hpf_ap_ip">

                <HPFPageTitle title ="Identify parts"/>

                <VSpacer height="10px"/>

                <HPFHiddenOnMobile>
                    <HPFPageDescription description ="Scan or enter a motorcycle part number to identify it."/>
                    <VSpacer height ="25px"/>
                </HPFHiddenOnMobile>
                
                <AddPartsOptions onVisionModeToggle={handleVisionMode}/>

                <VSpacer height ="30px"/>

                <Scanner 
                    ref= {scanner_ref}
                    onDetect={onDetect}
                    show_scanner_vision={vision_mode}
                />

                <VSpacer height ="15px"/>

                <PartIndicator part ={recognition_state.part} status = {recognition_state.status}/>

                <VSpacer height ="15px"/>
        
                <AddToInventoryButton 
                    disabled = {recognition_state.status=="unrecognized"}
                    onClick={()=>{add_part_to_inventory(recognition_state.part)}}
                />
                
                </div>

                <HPFHiddenOnMobile>
                <div className="hpf_recent_container">
                    <RecentlyAddedParts/>
                </div>
                </HPFHiddenOnMobile>
            </div>
        </HPFPageContainer>
    )
}

export default AddPartsPage;


