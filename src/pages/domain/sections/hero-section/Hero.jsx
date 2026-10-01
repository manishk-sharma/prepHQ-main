import React from 'react'
import '../../domain.css'

const Hero = ({data}) => {

    const {heroBgImage, domainBannerImage, title, description} = data;
    
  return (
                <div className='hero-section'>
                    <div className='hero-section-bg' style={{
                        "background-size": "cover",
                        "background-image": `url(${heroBgImage})`
                    }} ></div>
                    <section className="hero-section  py-4 py-lg-0 container">
                        <div className="hero-content">
                            <h1 className="hero-title">{title}</h1>
                            <p className="hero-description">
                                {description}
                            </p>
                        </div>
                        <div className="hero-illustration">
                            <img src={domainBannerImage} alt="data-science" />
                            {/* Illustration placeholder */}
                        </div>
                    </section>
                </div>
  )
}

export default Hero