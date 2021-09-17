

import './style/page_style.scss';

const HPFPageTitle=(props)=>{
    const {title}={...props}
    return <h1 className="hpf_page_title">{title}</h1>
}

const HPFPageDescription = (props)=>{
    const {description}={...props}
    return <h3 className="hpf_page_description">{description}</h3>
}

const createDivWithChildren = (className)=>(props)=>{
    return (
        <div className={className}>
            {props.children}
        </div>
    )
}

const HPFHiddenOnMobile = createDivWithChildren("hpf_hidden_on_mobile");
const HPFHiddenOnDesktop= createDivWithChildren("hpf_hidden_on_desktop");
const HPFShownOnMobile= createDivWithChildren("hpf_shown_on_mobile");
const HPFShownOnDesktop= createDivWithChildren("hpf_shown_on_desktop");
const HPFFixedIfMobile= createDivWithChildren("hpf_fixed_if_mobile");
const HPFPageContainer= createDivWithChildren("hpf_page_container");


export {
    HPFPageTitle,
    HPFPageContainer,
    HPFPageDescription,
    HPFFixedIfMobile,
    HPFHiddenOnMobile,
    HPFHiddenOnDesktop,
    HPFShownOnDesktop,
    HPFShownOnMobile
}