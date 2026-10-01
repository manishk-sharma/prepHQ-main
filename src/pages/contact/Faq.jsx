import React from 'react';
import "./faq.css";
import HeadingTop from '../../components/HeadingTop';
import FaqTabs from "./FaqTabs";
import ContactFaqImg from "../../assets/img/contact/contactfaqimage.webp";

const Faq = () => {
  return (
    <section className='contactfaq'>
        <div className='container'>
            <div className='parts'>
                <div className='left-part'>
                    <img src={ContactFaqImg} alt='contact faq image' className='contactfaqimage' width="515" height="472" />
                </div>
                <div className='right-part'>
                    <HeadingTop title="Faq" />
                    <h4 className='heading'>Frequently Asked <span>Questions</span></h4>
                    <FaqTabs />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Faq
