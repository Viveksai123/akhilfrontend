import React from 'react'
import Logo from '../assets/images/ttLogo.png'
import '../styles/header.css'
import { Link } from 'react-router-dom'

function header() {
  return (
    <div className='Header'>
        <div className="logo">        
        <img className='ttlogo' src={Logo} alt="Logo" />;       
        </div>
        <div className="Description">
            Welcome to Tkr Travels your one stop destination for all your travel bookings. 
            <br />Start your dream vacation by clicking on the search below.
        </div>
        <div className="signin-login">
        <Link to='/sign'>
         <div className="sign-in">
            <button className='sign-in-b'>Sign in</button>
         </div>
         </Link>
         <Link to='/sign'>
         <div className="log-in">
            <button className='log-in-b'>Log in</button>
         </div>
         </Link>
        </div>
        
    </div>
  )
}

export default header