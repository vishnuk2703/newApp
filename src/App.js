import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Oval } from 'react-loader-spinner';
import { CiShare2 } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";

function CardContainer() {
  const [cards, setCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://prod-be.1acre.in/lands/?division=24&page_size=10&page=${currentPage}&ordering=-updated_at`
      );
      const newData = await response.json();

      if (newData.results.length === 0) {
        setHasMore(false); 
      }

      setCards([...cards, ...newData.results]); 
      setCurrentPage(currentPage + 1); 
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); 

  const handleNext = (imagesLength) => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesLength);
  };

  const handlePrev = (imagesLength) => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagesLength - 1 : prevIndex - 1
    ); 
  };

  return (
    <InfiniteScroll
      dataLength={cards.length}
      next={fetchData}
      hasMore={hasMore}
      loader={
        isLoading && <div className="loader">
          <Oval height={30} width={30} color="yellow" strokeWidth={2} secondaryColor='yellow'/>
          <div>Loading...</div>
        </div>
      }
    >
      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} style={{ height: '240px' }} className="card" onMouseOver={() => {setHoveredCard(index); setCurrentIndex(0);}} onMouseLeave={() => setHoveredCard(null)}>
            <div style={{ height: '175px'}} className='first_part' >
              <div className='shareIcons'>
                <FaRegHeart className='roundedBorder' size={18}/>
                <CiShare2 className='roundedBorder' size={18}/>
              </div>
              {hoveredCard === index && <div className='leftcarousel' onClick={() => handlePrev(card.land_media.length)}><FaAngleLeft /></div>}
              {hoveredCard === index &&<div className='rightcarousel' onClick={() => handleNext(card.land_media.length)}><FaAngleRight /></div>}
              <img src={card.land_media[hoveredCard === index ? currentIndex : 0].image} alt='land images'  height='175px' className='landImage'/>
            </div>
            <div style={{ height: '65px'}} className='second_part'>
              <div className='boldFont'> ₹ {card.price_per_acre_crore?.crore ? card.price_per_acre_crore?.crore + " Crores " : ' '} {card.price_per_acre_crore?.lakh ? card.price_per_acre_crore?.lakh + " Lakhs " : ' '} • {card.total_land_size_in_acres?.acres ? card.total_land_size_in_acres?.acres + " Acres " : ' '} {card.total_land_size_in_acres?.guntas ? card.total_land_size_in_acres?.guntas + " Guntas " : ' '}</div>
              <div>{card.division_info[2].name}, {card.division_info[1].name} (dt)</div>
            </div>
            </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default CardContainer;
