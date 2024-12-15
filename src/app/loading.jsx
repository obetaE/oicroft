import React from 'react'
import Image from 'next/image';

const loading = () => {
  return (
    <div className="loading-container">
      <div className="load-img-container">
        <Image
          src="https://res.cloudinary.com/dudlxsoui/image/upload/v1733053570/Website_Page_piux2z.png"
          alt="loading image"
          width={200}
          height={200}
        />
        <div className="load-btn-container">
          <div className="loading-button"></div>
          <div className="loading-button"></div>
          <div className="loading-button"></div>
          <div className="loading-button"></div>
          <div className="loading-button"></div>
        </div>
      </div>
    </div>
  );
}

export default loading