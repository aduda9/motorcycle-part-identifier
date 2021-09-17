

import './style/topnav_style.scss';
import HPFLogo from '../../general/logo/logo';


import InventoryIcon from '../../general/svg/inventory_2'
import ScanIcon from '../../general/svg/add.js'

import React from 'react';

import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";

const TabIcon=(props)=>{

    const {
        icon:Icon,
        title,
        to,
        active,
        height
    }={...props};

    return (
        <button className="hpf_topnav_link_button">
            <Link to ={to}>
            <div className="hpf_topnav_icon">
                <Icon color = {active ? "#fff" : "#999"} />
            </div>
            </Link>
        </button>
    )
}

const Tabs = (props)=>{

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
        <>
          {tabs.map((t,i)=>(
            <TabIcon
                key={i}
                icon ={t.icon} 
                to={t.path} 
                active = {pathname==t.path}
            />)
        )}
        </>
    )

}

const HPFTopNav=(props)=>{
    return (
        <div className="hpf_topnav_container">
            <div className="hpf_topnav_content">
                <HPFLogo/>
                <div className="hpf_topnav_links">
                    <Tabs/>
                </div>
            </div>
        </div>
    )
}

export default HPFTopNav;

