import React from 'react';
import '../styles/Cards.css';

function Cards({ hotels }) {
  return (
    <div className="pop">
      <div className="pop-title">
        <h1>Most Booked Hotels in Popular Places</h1>
      </div>
      <div className="Cards1">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div key={hotel.id} className={hotel.className}>
              <div className={`${hotel.className}-images`}>
                <img src={hotel.image} alt={hotel.name} />
              </div>
              <div className={`${hotel.className}-d`}>
                <div className={`${hotel.className}-n`}>
                  <h4>{hotel.name}</h4>
                  <p>{hotel.location}</p>
                </div>
                <div className={`${hotel.className}-c`}>
                  <h5>{hotel.price}</h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'gray' }}>No hotels found</p>
        )}
      </div>
    </div>
  );
}

export default Cards;
