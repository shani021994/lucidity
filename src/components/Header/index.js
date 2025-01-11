import React from 'react'
import Navbar from '../Navbar'

export default function Header() {
  return (
    <header className='header' style={{padding:"4px 20px", display:"flex", justifyContent:'center', alignItems:"center", backgroundColor: "#e3f2fd", width:"100%"}}> 
      <Navbar />
    </header>
  )
}
