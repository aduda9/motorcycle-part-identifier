
import './style/style.scss';


import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";


const DesktopSidebarLink=(props)=>{
    const {active,title,to}={...props};
    return (<Link to={to} className={"hpf_sidebar_link "+(active ? "active":"")}>{title}</Link>);
}

const Logo = (props)=>{
    return <h1 className="fakeLogo">HPF</h1>
}

const DesktopSidebar = (props)=>{

    const {options} = {...props}

    const {pathname} = {...useLocation()};

    // console.log(pathname);

    const links = [
        {title:"Identify",path:"/"},
        {title:"Inventory",path:"/inventory"}
    ];

    return (
        <div className="hpf_sidebar_container">
            
            <Logo/>
                
            <div className="hpf_logo_spacer"/>

            <div className="hpf_sidebar_links_container">
                {links.map(l=>(
                    <DesktopSidebarLink 
                        title={l.title} 
                        to ={l.path} 
                        active = {pathname==l.path}
                    />)
            )}
            </div>
        </div>
    )
}

export default DesktopSidebar;