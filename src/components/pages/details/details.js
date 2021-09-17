
import { HPFPageContainer,HPFPageTitle,HPFFixedIfMobile,HPFHiddenOnMobile } from "../../general/page/hpf_page"

import {VSpacer} from '../../general/spacer.js'
import './style/style.scss'


const HPFPartDetail = (props)=>{
    
    return (
        <div className="hpf_part_details_container">
            <div className="hpf_part_details_desc">Description</div>
            <div className="hpf_part_details_title">Title</div>
        </div>
    )
}

const DetailsPage = ()=>{


    return (
        <HPFPageContainer>

            <HPFPageTitle title ="Part details"/>
            <VSpacer height ={40}/>
            <HPFPartDetail title = "Part title" description ="Part description"/>
            <VSpacer height ={15}/>
            <HPFPartDetail title = "Part title" description ="Part description"/>
            <VSpacer height ={15}/>
            <HPFPartDetail title = "Part title" description ="Part description"/>
            <VSpacer height ={15}/>
            <HPFPartDetail title = "Part title" description ="Part description"/>
            <VSpacer height ={15}/>
            <HPFPartDetail title = "Part title" description ="Part description"/>

        </HPFPageContainer>
    )

}

export default DetailsPage;