import React from 'react'
import { Link } from 'react-router-dom';

import HeadingTop from "../../components/HeadingTop";

import "./practice.css";
import NeedTechInterview from "./NeedTechInterview";
import PracticeCategories from "./PracticeCategories";


import PracticeBanner from "../../assets/img/practice/practice-banner-image.webp";
import featuredResources from "../../assets/img/practice/data-structures-and-algorithms.webp";
import videoLearningLibrary from "../../assets/img/practice/video-learning-library.webp";
import EBooksGuides from "../../assets/img/practice/e-books-guides.webp";
import businessMan from "../../assets/img/practice/businessman.webp";

const Practice = () => {
  return (
    <>
      <section className='practice-banner'>
        <div className='container'>
            <div className='row'>
                <div className='col-6'>
                    <h1 className='heading'>What You’ll Find Inside <span>prepHQ</span></h1>
                    <p className='tagline'>All-in-One Tech prep, Designed for Your Success</p>
                    <p>prepHQ offers every tool you need to master interviews, build skills, and grow confidently into your tech career.</p>
                    <p style={{marginTop:"30px"}}>prepHQ Practice is a 360° all-in-one coding and interview prep platform designed to help students and developers practice coding, strengthen problem-solving skills, and get interview-ready with features like mock interviews, step-by-step tutorials, Q&A banks, project ideas, and salary predictors, all 100% free.</p>
                </div>
                <div className='col-6'>
                    <img src={PracticeBanner} alt='PracticeBanner image' width="367" height="550" />
                </div>
            </div>
        </div>
      </section>

      <NeedTechInterview />

      <section className='practice-categories'>
        <PracticeCategories />
      </section>

      <section className='featured-resources'>
        <div className='container'>
            <HeadingTop title="Featured Resources" />
            <h3 className='heading'>Most Popular This Week</h3>
            <div className='parts'>
                <div className='part'>
                    <img src={featuredResources} alt='featured-resources image' width="527" height="305" />
                    <h4 className='head'>Advanced Python Interview Questions</h4>
                    <ul>
                        <li>50+ challenging Python questions with detailed explanations</li>
                        <li>Focus on decorators, generators, and metaclasses</li>
                        <li>Real interview experiences from FAANG companies</li>
                    </ul>
                </div>
                <div className='part'>
                    <img src={featuredResources} alt='featured-resources image' width="527" height="305" />
                    <h4 className='head'>System Design: Chat Application</h4>
                    <ul>
                        <li>Complete walkthrough of building a WhatsApp-like system</li>
                        <li>Covers messaging protocols, real-time communication, and scaling</li>
                        <li>Includes architecture diagrams and code examples</li>
                    </ul>
                </div>
                <div className='part'>
                    <img src={featuredResources} alt='featured-resources image' width="527" height="305" />
                    <h4 className='head'>SQL Optimisation Masterclass</h4>
                    <ul>
                        <li>Performance tuning techniques for complex queries</li>
                        <li>Index strategies and query execution plans</li>
                        <li>Case studies from production databases</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      <section className='career-tracks'>
        <div className='container'>
            <div className='parts'>
                <div className='part'>
                    <h3 className='heading'>Specialized Career Tracks</h3>
                </div>
                <div className='part'>
                    <ul>
                        <li><span>Backend Developer Path:</span> APIs, databases, server architecture</li>
                        <li><span>Frontend Developer Path:</span> JavaScript, frameworks, UI/UX principles</li>
                        <li><span>Data Scientist Path:</span> Statistics, ML algorithms, data visualisation</li>
                        <li><span>DevOps Engineer Path:</span> Cloud platforms, CI/CD, infrastructure</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      <section className='learning-paths'>
        <div className='container'>
            <HeadingTop title="Learning Paths" />
            <h3 className='heading'>Beginner to Expert Tracks</h3>
            <div className='parts'>
                <div className='part'>
                    <div className='number'>01</div>
                    <h4 className='head'>Foundation Phase (Weeks 1-4)</h4>
                    <ul>
                        <li>Basic data structures and algorithms</li>
                        <li>Programming fundamentals review</li>
                        <li>Simple coding challenges</li>
                    </ul>
                </div>
                <div className='part'>
                    <div className='number'>02</div>
                    <h4 className='head'>Intermediate Phase (Weeks 5-8)</h4>
                    <ul>
                        <li>Advanced algorithms and complexity analysis</li>
                        <li>Object-oriented design principles</li>
                        <li>Medium-level coding problems</li>
                    </ul>
                </div>
                <div className='part'>
                    <div className='number'>03</div>
                    <h4 className='head'>Advanced Phase (Weeks 9-12)</h4>
                    <ul>
                        <li>System design fundamentals</li>
                        <li>Complex problem-solving strategies</li>
                        <li>Mock interview practice</li>
                    </ul>
                </div>
            </div>
        </div>
        <svg className='learning-paths-bg' xmlns="http://www.w3.org/2000/svg" width="1530" height="130" viewBox="0 0 1530 130" fill="none">
            <path d="M1531 2C1428.7 64.4129 1165.95 172.979 933.417 107.938C642.748 26.6367 500.833 -15.2457 258.893 46.346C65.3411 95.6194 4.98438 113.686 -1 116.561" stroke="#002147"/>
        </svg>
      </section>

      <section className='code-sheet'>
        <div className='container'>
            <div className='parts'>
                <div className='part'>
                    <h4 className='heading'>Code Snippet Library</h4>
                    <p>Ready-to-use implementations of common algorithms and data structures with detailed comments and usage examples.</p>
                    <Link to="/">Explore Snippets</Link>
                </div>
                <div className='part'>
                    <h4 className='heading'>Interview Cheat Sheets</h4>
                    <p>Quick reference guides for:</p>
                    <ul>
                        <li>Time & Space Complexity Charts</li>
                        <li>Common Algorithm Patterns</li>
                        <li>System Design Components</li>
                        <li>SQL Command Reference</li>
                    </ul>
                    <Link to="/">Explore Snippets</Link>
                </div>
            </div>
        </div>
      </section>

      <section className='additional-learning'>
        <div className='container'>
             <HeadingTop title="Additional Learning Materials" />
             <div className='parts'>
                <div className='part'>
                    <div className='image-part'>
                        <img src={videoLearningLibrary} alt='Video Learning Library' width="214" height="214" />
                    </div>
                    <div className='content-part'>
                        <h4 className='head'>Video Learning Library</h4>
                        <p className='tagline'>100+ Expert-Created  Videos</p>
                        <ul>
                            <li>Step-by-step problem walkthroughs</li>
                            <li>Concept explanations with animations</li>
                            <li>Live coding sessions</li>
                            <li>Industry expert interviews</li>
                        </ul>
                    </div>
                </div>
                <div className='part'>
                    <div className='image-part'>
                        <img src={EBooksGuides} alt='E-Books & Guides' width="214" height="214" />
                    </div>
                    <div className='content-part'>
                        <h4 className='head'>E-Books & Guides</h4>
                        <p className='tagline'>Comprehensive Study Materials</p>
                        <ul>
                            <li>Complete Guide to Technical Interviews</li>
                            <li>System Design Simplified</li>
                            <li>Cracking Coding Challenges</li>
                            <li>Career Transition Handbook</li>
                        </ul>
                    </div>
                </div>
             </div>
        </div>
      </section>

      <section className='get-start'>
        <div className='container'>
            <div className='parts'>
                <div className='part'>
                    <img src={businessMan} alt='businessman image' width="" height="" />
                </div>
                <div className='part'>
                    <h4 className='heading'>Get Started <span>Today</span></h4>
                    <p><strong>Ready to dive in?</strong> Browse our resource categories above or use the search function to find specific topics. Whether you're preparing for your first technical interview or advancing your career, our comprehensive resource library has everything you need to succeed.</p>
                    <p><strong>New to PrepHQ?</strong> Start with our [Getting Started Guide] to learn how to navigate our resources effectively and create your personalised learning plan.</p>
                </div>
            </div>
        </div>
        <div className='bg-line'>
            <svg xmlns="http://www.w3.org/2000/svg" width="343" height="166" viewBox="0 0 343 166" fill="none">
                <path d="M341 1C314.333 31.5 163.512 147.16 184 89C215 1 37 98 0.5 164.5" stroke="#57CC99"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="339" height="166" viewBox="0 0 339 166" fill="none">
                <path d="M1.5 1C28.1667 31.5 178.988 147.16 158.5 89C127.5 1 305.5 98 342 164.5" stroke="#57CC99"/>
            </svg>
        </div>
      </section>

    </>
  )
}

export default Practice
