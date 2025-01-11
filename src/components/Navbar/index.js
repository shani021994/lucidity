import React from 'react'
import { menuData } from './data'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate=useNavigate()
    const location=useLocation()
    const pathnameArr=location?.pathname 
     const navChangeHandler=(data)=>{ 
           navigate(`/${data}`)
     }
    return (
        <nav >
            <ul style={{ listStyle: "none", display: "flex", alignItems: "center", margin:"0px", }}>
                {menuData.map((item, index) => { 
                    return <li style={{padding:'10px', margin:"0px 8px", cursor:"pointer", color:`${pathnameArr===`/${item?.id}` ? "blue": ""}`}} key={JSON.stringify(index)} onClick={()=>navChangeHandler(item?.id)}>{item?.name}</li>
                })}
            </ul>
        </nav>
    )
}
