import React from 'react'
import Image from 'next/image';

const loading = () => {
  return (
    <div className="loading-container" >
      
      <div className="load-img-container" >
        <Image src="/Website page.png" alt='loading image' width={200} height={200} />
        <div className='load-btn-container' >
          <div className='loading-button' ></div>
          <div className='loading-button' ></div>
          <div className='loading-button' ></div>
          <div className='loading-button' ></div>
          <div className='loading-button' ></div>
        </div>
      </div>

    </div>
  )
}

export default loading