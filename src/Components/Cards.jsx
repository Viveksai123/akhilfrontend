import React from 'react'
import img1 from '../assets/images/novotel-img.jpg'
import img2 from '../assets/images/fortekochi-img.jpeg'
import img3 from '../assets/images/himali-img.jpeg'
import '../styles/Cards.css'

function Cards() {
  return (
    <>
<div className="pop">
    <div className="pop-title"><h1>Most Booked Hotels in Popular Places</h1></div>   
    <div className='Cards1'>        
        <div className="card-1">
            <div className="card-1-images">
                <img src={img1} alt="" />     
            </div>
            <div className="card-1-d">
                <div className="card-1-n">
                    <h4>Novotel</h4>
                    <p>Hyderabad,Telangana</p>                    
                </div>
                <div className="card-1-c">
                    <h5>16,000/-</h5>
                </div>
            </div>
        </div>
        <div className="card-2">
            <div className="card-1-images">
                <img src={img2} alt="" />     
            </div>
            <div className="card-2-d">
                <div className="card-2-n">
                    <h4>Forte Kochi</h4>
                    <p>Kochi,Kerala</p>                    
                </div>
                <div className="card-2-c">
                    <h5>23,000/-</h5>
                </div>
            </div>
        </div>
        <div className="card-3">
            <div className="card-1-images">
                <img src={img3} alt="" />     
            </div>
            <div className="card-3-d">
                <div className="card-3-n">
                    <h4>Hemali Heights</h4>
                    <p>Manali, Himachal Pradesh</p>                    
                </div>
                <div className="card-3-c">
                    <h5>3,000/-</h5>
                </div>
            </div>
        </div>
    </div>
    <br /><br /><br />
    <div className="Cards2">
        <div className="card-2">
            <div className="card-1-images">
                <img src={img2} alt="" />     
            </div>
            <div className="card-2-d">
                <div className="card-2-n">
                    <h4>Forte Kochi</h4>
                    <p>Kochi,Kerala</p>                    
                </div>
                <div className="card-2-c">
                    <h5>23,000/-</h5>
                </div>
            </div>
        </div>
    <div className="card-1">
            <div className="card-1-images">
                <img src={img1} alt="" />     
            </div>
            <div className="card-1-d">
                <div className="card-1-n">
                    <h4>Novotel</h4>
                    <p>Hyderabad,Telangana</p>                    
                </div>
                <div className="card-1-c">
                    <h5>16,000/-</h5>
                </div>
            </div>
        </div>
        
        <div className="card-3">
            <div className="card-1-images">
                <img src={img3} alt="" />     
            </div>
            <div className="card-3-d">
                <div className="card-3-n">
                    <h4>Hemali Heights</h4>
                    <p>Manali, Himachal Pradesh</p>                    
                </div>
                <div className="card-3-c">
                    <h5>3,000/-</h5>
                </div>
            </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default Cards