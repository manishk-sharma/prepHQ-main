import React from 'react'

const NeedTechInterview = () => {
    const techInterviewPoint = [
        {
            title : "Mock Interviews",
            desc : "Simulate real tech interviews with expert feedback to boost your confidence and communication."
        },
        {
            title : "Tech Interview Q&A Bank",
            desc : "Access a curated collection of real interview questions and answers from top tech companies."
        },
        {
            title : "Step-by-step tutorial guides",
            desc : "Learn every concept with clear, beginner-friendly tutorials and code walkthroughs."
        },
        {
            title : "Mini Guides",
            desc : "Quick, focused guides to help you revise core topics and key concepts in minutes."
        },
        {
            title : "Salary Predictor",
            desc : "Estimate your expected salary based on role, experience, skills, and market trends."
        },
        {
            title : "Discussion Forums",
            desc : "Join a growing tech community to ask questions, share insights, and prepare together."
        },
    ];
  return (
    <>
        <section className='need-tech-interview'>
            <div className='container'>
                <h2 className='heading'>Everything You Need to Excel in <span>Tech Interviews</span></h2>
                <div className='parts'>
                    {techInterviewPoint.map((item, index) => (
                        <div className='part' key={index}>
                            <div className='number'>
                                {String(index + 1).padStart(2, "0")}
                            </div>
                            <div className='content'>
                                <h3 className='head'>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <svg className='tech-interview-bg' xmlns="http://www.w3.org/2000/svg" width="1324" height="654" viewBox="0 0 1324 654" fill="none">
                <g filter="url(#filter0_f_932_3202)">
                    <path d="M565 327C565 458.444 458.444 565 327 565C195.556 565 89 458.444 89 327C89 195.556 195.556 89 327 89C458.444 89 565 195.556 565 327Z" fill="#D3F3E9"/>
                    <path d="M1235 327C1235 458.444 1128.44 565 997 565C865.556 565 759 458.444 759 327C759 195.556 865.556 89 997 89C1128.44 89 1235 195.556 1235 327Z" fill="#E1DDFF"/>
                    <path d="M900 327C900 458.444 793.444 565 662 565C530.556 565 424 458.444 424 327C424 195.556 530.556 89 662 89C793.444 89 900 195.556 900 327Z" fill="#FDEECC"/>
                </g>
                <defs>
                    <filter id="filter0_f_932_3202" x="0.599998" y="0.599998" width="1322.8" height="652.8" filterUnits="userSpaceOnUse">
                    <feFlood result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="44.2" result="effect1_foregroundBlur_932_3202"/>
                    </filter>
                </defs>
            </svg>
        </section>
    </>
  )
}

export default NeedTechInterview
