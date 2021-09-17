
import { useEffect, useLayoutEffect,useRef,useState,forwardRef,useImperativeHandle } from 'react';
import './style/scanner_style.scss'


import Webcam from "react-webcam";

import Tesseract from 'tesseract.js';


const filter_part_number=(text)=>{

    const pn_regex = /[a-zA-Z0-9]{5}-[a-zA-Z0-9]{3}-([a-zA-Z0-9]{5}|[a-zA-Z0-9]{3})/g;
    return text.match(pn_regex);

}




const WIDTH=960;
const HEIGHT=540;

const NUM_WORKERS=3;

const FRAME_WIDTH=WIDTH/4;
const FRAME_HEIGHT=HEIGHT/4;


const threshold_image=(pixels,lowcolor=0,highcolor=255)=>{

    let thresh_start=0;

    // for (let i=0; i<pixels.length; i+=4){
       
    // }


    for (let i=0; i<pixels.length; i+=4){

        // let hsv = rgb2hsv(pixels[i],pixels[i+1],pixels[i+2]);
        // let hue = hsv.h;
        // if (((hue >330 && hue <360) || (hue < 30 && hue >0)) && hsv.s>60 ){
        //     pixels[i]     = 255;
        //     pixels[i + 1] = 255;
        //     pixels[i + 2] = 255;
        //     continue
        // }
        let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        pixels[i]     = lightness;
        pixels[i + 1] = lightness;
        pixels[i + 2] = lightness;
        thresh_start+=lightness;
    }

    thresh_start=thresh_start/(pixels.length/4);

    for (let i=0; i<pixels.length; i+=4){

        let lightness = (pixels[i] > thresh_start) ? highcolor : lowcolor;
        pixels[i]     = lightness;
        pixels[i + 1] = lightness;
        pixels[i + 2] = lightness;
    }

    return pixels;

}

const getOrientationListenerFuncs=()=>{
    const screen = window.screen;
    if (screen.orientation){
        return [
            (handler)=>screen.orientation.addEventListener('change',handler),
            (handler)=>screen.orientation.removeEventListener('change',handler)
        ]
    }
    return [
        (handler)=>window.addEventListener('orientationchange',handler),
        (handler)=>window.removeEventListener('orientationchange',handler),
    ]
}


const getOrientation=()=>{
    const screen = window.screen;

    let orientation = (screen.orientation || screen.mozOrientation || screen.msOrientation)
    if (orientation){
        const is_landscape = orientation.type =="landscape-primary" || orientation =="landscape-secondary"
        return is_landscape ? "landscape" :"portrait"
    }
    orientation = window.orientation
    // console.log(orientation);
    if (orientation!=undefined){
        const is_landscape = orientation ==90 || orientation == -90
        return is_landscape ? "landscape" :"portrait"
    }
    return "landscape";
}

const createCanvasOfSize=(source_canvas,width,height)=>{
    const canvas = document.createElement('canvas');
    canvas.width=width;
    canvas.height=height;
    const context = canvas.getContext('2d')
    context.drawImage(source_canvas,0,0,width,height);
    return [canvas,context]
}

const initial_scanner_settings={
    show:false,
    box_color:"#fff",
}

const Scanner =  forwardRef((props,ref)=>{

    const webcam_ref = useRef();
    const canvas_ref = useRef();
    const scanner_settings_ref = useRef(initial_scanner_settings);
    const scheduler_ref=useRef();
    const initialized_ref=useRef(false);
    const media_stream_ref=useRef(null);
    const box_data_ref=useRef([]);

    const [facing,setFacing]=useState('environment');

    const {onDetect,onClear}={...props}

    const { createWorker, createScheduler } = Tesseract;

    useImperativeHandle(ref, () => ({

        setShowScannerVision(show) {
            scanner_settings_ref.current={
                ...scanner_settings_ref.current,
                show:show,
            };
        },

        setScannerBoxColor(color){
            scanner_settings_ref.current={
                ...scanner_settings_ref.current,
                box_color:color
            };
        }
    
      }));
   
    const getFrameCanvas=()=>{
        const {current:canvas}=canvas_ref;
        return createCanvasOfSize(canvas,FRAME_WIDTH,FRAME_HEIGHT);
    }

    const recognize_text = async ()=>{

        const {current:scheduler} = {...scheduler_ref};

        let [screenshot_canvas,screenshot_context] = getFrameCanvas();
            
        let img_data = screenshot_context.getImageData(0,0,FRAME_WIDTH,FRAME_HEIGHT);
        threshold_image(img_data.data)
        
        screenshot_context.putImageData(img_data,0,0);

        // var link = document.createElement('a');
        // link.download = 'filename.png';
        // link.href = screenshot_canvas.toDataURL()
        // link.click();


        const t1=Date.now();
        const { data } = await scheduler.addJob('recognize', screenshot_canvas);
        
        const t2=Date.now();
        const {text,box} = data;

        let box_data=box.split('\n');
        let boxes=box_data.map(box_str=>{
            if (box_str=='') return null;
            let box_str_arr=box_str.split(' ');
            let box_coords=[]
            for (let i=1; i<5; i++){
                box_coords.push(parseInt(box_str_arr[i]))
            }
            return box_coords;
        })

        box_data_ref.current=boxes;

        let part_number_result = filter_part_number(text);
        if (part_number_result){

            let part_number=part_number_result[0];
            onDetect?.(part_number);
        }
        

    }

    const draw_webcam_to_canvas = ()=>{

        const canvas = canvas_ref.current;
        const show_scanner_vision=scanner_settings_ref.current.show;

        const context = canvas.getContext('2d');
        
        const video = webcam_ref.current.video;
        context.drawImage(video,0,0,WIDTH,HEIGHT);

        let img_data;

        const drawBoxes=(context,boxes)=>{
            const {box_color} = scanner_settings_ref.current
            if (!boxes) return;
            boxes.map(box=>{
                if (!box) return;
                context.strokeStyle=box_color;
                context.lineWidth=2;
                context.strokeRect(...box.map(coord=>coord*WIDTH/FRAME_WIDTH))
            })
        }
        
        if (show_scanner_vision){

            let [screenshot_canvas,screenshot_context] = getFrameCanvas();
            img_data = screenshot_context.getImageData(0,0,FRAME_WIDTH,FRAME_HEIGHT);
            threshold_image(img_data.data);
            screenshot_context.putImageData(img_data,0,0);

            const [exp,exp_context]=createCanvasOfSize(screenshot_canvas,WIDTH,HEIGHT);

            drawBoxes(exp_context,box_data_ref.current)
            
            img_data=exp_context.getImageData(0,0,WIDTH,HEIGHT)

        }
        else{
            drawBoxes(context,box_data_ref.current)
            img_data = context.getImageData(0,0,WIDTH,HEIGHT);
        }

        context.putImageData(img_data,0,0);

    }

    const build_tessract_scheduler=async ()=>{

        const scheduler = createScheduler();
        for (let i = 0; i < NUM_WORKERS; i++) {
            let worker = createWorker();
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            await worker.setParameters({
                tessedit_ocr_engine_mode:Tesseract.OEM.OEM_LSTM_ONLY,
                tessedit_pageseg_mode:Tesseract.PSM.PSM_AUTO,
                tessjs_create_box:'1',
            })
            scheduler.addWorker(worker);
        }
        scheduler_ref.current=scheduler;
    }

    // let test_aspect=getOrientation();

    useLayoutEffect(()=>{
        
        let timer_id;
        let recognize_interval;
        let paused=false;
        let cancelled = false;

        const initialized = initialized_ref.current;

        const resize_handler=()=>{
            
            if (cancelled || !canvas_ref.current || webcam_ref.current) return;
            const orientation=getOrientation();

            // console.log(webcam_ref.current);
            const media = media_stream_ref.current;
            const track =media.getTracks()[0];
            // console.log(track);
            const aspect_ratio = orientation=="landscape" ? 16/9 : 9/16;

            track.applyConstraints({
                aspectRatio:aspect_ratio,
            })

            const constraints=track.getConstraints();
            // console.log(constraints)
        }



        const [set_on_orientation,remove_on_orientation]=getOrientationListenerFuncs();
        
        const initialize = async()=>{


            if (!initialized){
                await build_tessract_scheduler();
                initialized_ref.current=true;
                set_on_orientation(resize_handler);
                resize_handler();
            }

            const live_animation_handler = ()=>{
                if (canvas_ref.current && !paused){
                    draw_webcam_to_canvas();
                }
                timer_id = requestAnimationFrame(live_animation_handler);
            }
       
            timer_id = requestAnimationFrame(live_animation_handler);

            if (!cancelled){
                recognize_interval=setInterval(recognize_text,1000);
            }

        }

        initialize();

        return ()=>{
            cancelled=true;
            if (timer_id)               cancelAnimationFrame(timer_id);
            if (recognize_interval)     clearInterval(recognize_interval);
        }
    },[facing])

    const onDoubleClick=()=>{
        setFacing(facing=='environment' ? 'user':'environment')
    }

    const initial_aspect_ratio = getOrientation() =="landscape" ? 16/9 : 9/16;

    return (
        <div className="scanner_content_wrapper">
        <div className="scanner_aspect_ratio_hack"/>
            <div 
                className="scanner_content"
            >

                <div className="scanner_rectangle top"/>
                <div 
                    onDoubleClick={onDoubleClick}
                    className="scanner_clickable"
                >

                <canvas 
                    className="camera_style" 
                    ref={canvas_ref}
                    width ={WIDTH} 
                    height={HEIGHT}
                >
                </canvas>
                </div>
                <Webcam 
                    ref = {webcam_ref}
                    videoConstraints={{
                        aspectRatio: initial_aspect_ratio,
                        width:WIDTH,
                        height:HEIGHT,
                        facingMode:facing
                    }}
                    id="test_id"
                    muted
                    className="webcam_original"
                    onUserMedia={m=>{media_stream_ref.current=m}}
                />

                <div className="scanner_rectangle bottom"/>
                
            </div>
        </div>
    )
});

export default Scanner;