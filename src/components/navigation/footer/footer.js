

import './style/footer_style.scss';
import HPFLogo from '../../general/logo/logo';

import React from 'react';

import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";



const HPFFooter=(props)=>{
    return (
        <div className="hpf_footer_container">
            <div className="hpf_footer_content">
                <span className="hpf_footer_dummy"/>
                <div className="hpf_footer_link">
                    View code on &nbsp;
                    <div className="eb">GitHub</div>
                </div>
            </div>
        </div>
    )
}

export default HPFFooter;

