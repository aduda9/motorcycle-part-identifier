
import {useState,useRef} from 'react'
// import './style/style.scss'
import { useSpring, animated } from 'react-spring'

import  './style/style.scss'

import style_vars from './style/exports.module.scss'
import classNames from 'classnames'

const HPFToggleText=(props)=>{ 

    const {options,default_option,onToggle} = {...props};
    const default_option_index = default_option != undefined ? default_option : 0;

    const [active_option_index,setActiveOptionIndex]=useState(default_option_index);

    // used to apply css class to text *after* animation finished
    const [current_option_index,setCurrentOptionIndex]=useState(default_option_index);


    const {hpf_toggle_text_width} ={...style_vars}; 

    const item_width = parseInt(hpf_toggle_text_width)/options.length;

    const ref = useRef();

    const { x } = useSpring({
        from:{
            x:item_width*(active_option_index-1),
        },
        to:{
            x:item_width*(active_option_index),
        },
        onRest:()=>{setCurrentOptionIndex(active_option_index)},
        immediate:!ref.current,
        config:{
            tension:1200,
            clamp:true,
        },
        reset:false,
        // reverse: active,
    })

    return (

        <div ref={ref} className="hpf_toggle_text_container">

            <animated.div 
                className="hpf_toggle_text_option_indicator" 
                style = {{
                    width:item_width,
                    left:x,
                }}
            />

            {options.map((title,index)=>(
                <button 
                    key={index}
                    style={{width:item_width}} 
                    onClick={()=>{setActiveOptionIndex(index); onToggle?.(title)}}
                    className={"hpf_toggle_text_option "+(index==current_option_index ? "active" :"")}>
                        {title}
                </button>)
            )}

        </div>
    )
}

const HPFToggle = (props)=>{


    const {on_by_default,onToggle}={...props}

    const [active, set] = useState(on_by_default)

    const {hpf_toggle_inner_width,hpf_toggle_indicator_size} ={...style_vars}
    const left_value_active = parseInt(hpf_toggle_inner_width)-parseInt(hpf_toggle_indicator_size);

    const ref = useRef();

    const { x } = useSpring({

        to:{
            x:0,
        },
        from:{
            x:left_value_active
        },
        immediate:!ref.current,
        config:{
            tension:800,
            clamp:true,
        },
        reset:false,
        reverse: active,
    })

    const handleClick=()=>{
        set(!active);
        onToggle?.(!active);
    }

    return(
        <div ref={ref} className="hpf_toggle_container">
            <div 
                onClick={handleClick}
                className="hpf_toggle_clickable_area left"
            />
            <div className="hpf_toggle_container_inner">
                <animated.div
                    style={{
                        left:x
                    }}
                    className={classNames({hpf_toggle_indicator:true,active:active})}
                />
            </div>
            <div 
                onClick={handleClick}
                className="hpf_toggle_clickable_area right"
            />

        </div>
    )
}


export {HPFToggleText,HPFToggle}