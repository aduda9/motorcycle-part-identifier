

import './style/style.scss';
import InventoryIcon from '../../general/svg/inventory_2'
import HomeIcon from '../../general/svg/home'
import ScanIcon from '../../general/svg/add.js'

import React from 'react';


import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";

  

const MobileTabButton=(props)=>{

    const {
        icon:Icon,
        title,
        to,
        active,
        height
    }={...props};

    return (
        <div className="hpf_mt_button_container">
                <button className="hpf_mt_tab_button">
                    <Link to ={to}>
                    <div className="hpf_mt_icon_container" style ={{height:height}}>
                        <Icon color = {active ? "#fff" : "#999"} />
                    </div>
                    </Link>
                </button>
            </div>
    )
}


const MobileTabs = (props)=>{

    const tabs = [
        {
            title:"Identify",
            path:"/",
            icon:ScanIcon
        },
        {
            title:"Inventory",
            path:"/inventory",
            icon:InventoryIcon
        }
    ];
    const {pathname} = {...useLocation()};

    return (
        <div className="hpf_mt_container">
          {tabs.map((t,i)=>(
            <MobileTabButton 
                icon ={t.icon} 
                key={i}
                to={t.path} 
                active = {pathname==t.path}
            />)
        )}
        </div>
    )

}

export default MobileTabs;