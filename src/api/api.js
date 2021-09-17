


import axios from 'axios';

/* 
    switch BACKEND_BASE_URL below for local backend testing
*/

// const BACKEND_BASE_URL = "http://0.0.0.0:5000" 
const BACKEND_BASE_URL="https://hpf-backend.herokuapp.com"

const BACKEND_API_URL = "/api/v1/"
const GET_DATA_URL = "get_data"

const get_part_data=(part_number)=>{
    const URL = BACKEND_BASE_URL+BACKEND_API_URL+GET_DATA_URL
    return new Promise((resolve,reject)=>{
        axios.get(URL,{
            params:{
                part_number:part_number
            }
        }).then(r=>resolve(r.data),e=>reject(e))
    });
    
}

export {
    get_part_data
}