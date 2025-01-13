
import Header from '../Components/Header';
import Search from '../Components/Search';
import Cards from '../Components/Cards';
import Footer from '../Components/Footer';
import img1 from '../assets/images/novotel-img.jpg';
import img2 from '../assets/images/fortekochi-img.jpeg';
import img3 from '../assets/images/himali-img.jpeg';
import React, { useState } from 'react';


const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const hotels = [
    { id: 1, name: 'Novotel', location: 'Hyderabad, Telangana', price: '16,000/-', image: img1, className: 'card-1' },
    { id: 2, name: 'Forte Kochi', location: 'Kochi, Kerala', price: '23,000/-', image: img2, className: 'card-2' },
    { id: 3, name: 'Hemali Heights', location: 'Manali, Himachal Pradesh', price: '3,000/-', image: img3, className: 'card-3' },
    { id: 4, name: 'Forte Kochi', location: 'Kochi, Kerala', price: '23,000/-', image: img2, className: 'card-2' },
    { id: 5, name: 'Novotel', location: 'Hyderabad, Telangana', price: '16,000/-', image: img1, className: 'card-1' },
    { id: 6, name: 'Hemali Heights', location: 'Manali, Himachal Pradesh', price: '3,000/-', image: img3, className: 'card-3' },
  ];

  // Filter hotels based on search input
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
      
        <>
            <Header />
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Cards hotels={filteredHotels} />
            <br />
            <br />
            <Footer />
        </>
    );
};

export default Home;
