import './style/style.scss';


const HPFLabeledComponent=(props)=>{

    const {title,children,alignRight}={...props};
    
    return (

        <div className="hpf_option_label_container">
            <div className="hpf_option_label">{title}</div>
            <div className="hpf_option_container">
                <div 
                    style ={alignRight ? {float:"right"}:null}
                    className="hpf_option_floater">
                    {children}
                </div>
            </div>
        </div>
    )

}

const HPFLabel =(props)=>{
    const {title} = {...props};
    return <div className="hpf_option_label">{title}</div>
}

export {HPFLabeledComponent,HPFLabel};

