import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import HeadingTop from "../../components/HeadingTop";

import DataStructuresAlgorithms from "../../assets/img/practice/data-structures-and-algorithms.webp";
import SystemDesign from "../../assets/img/practice/system-design.webp"
import DatabaseManagement from "../../assets/img/practice/database-management.webp"
import ProgrammingLanguages from "../../assets/img/practice/programming-languages.webp"
import MachineLearning from "../../assets/img/practice/machine-learning.webp"
import Scripting from "../../assets/img/practice/scripting.webp"
import UIUXDesign from "../../assets/img/practice/ux-design.webp"
import WebDevelopment from "../../assets/img/practice/web-development.webp"
import Testing from "../../assets/img/practice/testing.webp"
import DevOps from "../../assets/img/practice/devops.webp"
import AgileAndProjectManagement from "../../assets/img/practice/agile-and-project-management.webp"
import NetworkingAndSecurity from "../../assets/img/practice/networking-and-security.webp"

const PracticeCategories = () => {
  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // first tab active by default

  const tabCategory = [
    { 
        name: "Data Structures & Algorithms", 
        image: (<img src={DataStructuresAlgorithms} alt='' />),
        desc: "Master the fundamentals with our curated collection of 700+ coding problems covering arrays, linked lists, trees, graphs, dynamic programming, and advanced algorithms. Each problem includes multiple solution approaches, complexity analysis, and real-world applications.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>200+ Array & String Problems</li>
                <li>150+ Tree & Graph Challenges</li>
                <li>Guides & Mini-Guides</li>
                <li>Sorting & Searching Algorithms</li>
                <li>Advanced Data Structure Implementations</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "System Design", 
        image: (<img src={SystemDesign} alt=""/>),
        desc: "Build scalable thinking with our system design resources covering everything from basic concepts to complex distributed systems used by top tech companies.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>System Design Fundamentals</li>
                <li>Load Balancing & Caching Strategies</li>
                <li>Database Design Patterns</li>
                <li>Microservices Architecture</li>
                <li>Real-world System Design Cases (Netflix, Instagram, WhatsApp)</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Database Management", 
        image: (<img src={DatabaseManagement} alt=""/>),
        desc: "Master SQL and NoSQL databases with practical examples, optimisation techniques, and real-world scenarios used in production environments.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>SQL Query Optimisation</li>
                <li>Database Schema Design</li>
                <li>NoSQL Database Patterns</li>
                <li>Performance Tuning Guides</li>
                <li>Transaction Management</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Programming Languages", 
        image: (<img src={ProgrammingLanguages} alt=""/>),
        desc: "Build portfolio-worthy applications with our hands-on Python projects that demonstrate real-world skills to potential employers.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>Web Scraping Applications</li>
                <li>API Development Projects</li>
                <li>Data Analysis Tools</li>
                <li>Automation Scripts</li>
                <li>Machine Learning Implementations</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Machine Learning", 
        image: (<img src={MachineLearning} alt=""/>),
        desc: "Dive into ML with practical projects and implementations covering supervised learning, unsupervised learning, and deep learning fundamentals.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>ML Algorithm Implementations</li>
                <li>Data Preprocessing Techniques</li>
                <li>Model Evaluation Strategies</li>
                <li>Real-world ML Projects</li>
                <li>Neural Network Foundations</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Scripting", 
        image: (<img src={Scripting} alt=""/>),
        desc: "Automate repetitive tasks and streamline workflows with our comprehensive scripting resources covering shell scripting, automation frameworks, and cross-platform scripting solutions.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>Shell Scripting Fundamentals (Bash, PowerShell)</li>
                <li>Python Automation Scripts</li>
                <li>Task Scheduling & Cron Jobs</li>
                <li>Log Processing & System Monitoring</li>
                <li>CI/CD Pipeline Scripts</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "UI/UX Design", 
        image: (<img src={UIUXDesign} alt=""/>),
        desc: "Create intuitive and engaging user experiences with our design resources covering user research, wireframing, prototyping, and modern design principles.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>User Research Methodologies</li>
                <li>Wireframing & Prototyping Tools</li>
                <li>Design System Creation</li>
                <li>Accessibility Standards (WCAG)</li>
                <li>Mobile-First Design Principles</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Web Development", 
        image: (<img src={WebDevelopment} alt=""/>),
        desc: "Build modern, responsive web applications with our full-stack development resources covering frontend frameworks, backend technologies, and deployment strategies.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>Frontend Frameworks (React, Angular, Vue.js)</li>
                <li>Backend Development (Node.js, Django, Spring)</li>
                <li>RESTful API Design & Implementation</li>
                <li>Responsive Web Design Techniques</li>
                <li>Web Performance Optimisation</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Testing", 
        image: (<img src={Testing} alt=""/>),
        desc: "Ensure code quality and reliability with our comprehensive testing resources covering unit testing, integration testing, automation frameworks, and quality assurance methodologies.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>Unit Testing Best Practices</li>
                <li>Test Automation Frameworks (Selenium, Jest, PyTest)</li>
                <li>API Testing & Validation</li>
                <li>Performance Testing Strategies</li>
                <li>Test-Driven Development (TDD)</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "DevOps", 
        image: (<img src={DevOps} alt=""/>),
        desc: "Bridge development and operations with our DevOps resources covering containerization, orchestration, infrastructure as code, and continuous deployment practices.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>Docker & Kubernetes Fundamentals</li>
                <li>CI/CD Pipeline Design</li>
                <li>Infrastructure as Code (Terraform, Ansible)</li>
                <li>Monitoring & Logging Solutions</li>
                <li>Cloud Platform Integration (AWS, Azure, GCP)</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Agile & Project Management", 
        image: (<img src={AgileAndProjectManagement} alt=""/>),
        desc: "Master modern project management methodologies with our resources covering Agile frameworks, team collaboration, and project delivery strategies used in tech organizations.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>Scrum & Kanban Methodologies</li>
                <li>Sprint Planning & Retrospectives</li>
                <li>Stakeholder Management</li>
                <li>Risk Assessment & Mitigation</li>
                <li>Team Leadership & Communication</li>
            </ul>
        ),
        link: "/"
    },
    { 
        name: "Networking & Security", 
        image: (<img src={NetworkingAndSecurity} alt=""/>),
        desc: "Secure and optimize network infrastructure with our cybersecurity and networking resources covering protocols, security frameworks, and threat mitigation strategies.",
        head2nd: "What You'll Find",
        list: (
            <ul>
                <li>Network Protocol Fundamentals (TCP/IP, HTTP/HTTPS)</li>
                <li>Cybersecurity Best Practices</li>
                <li>Penetration Testing Techniques</li>
                <li>Firewall Configuration & Management</li>
                <li>Encryption & Authentication Methods</li>
            </ul>
        ),
        link: "/"
    },

  ];

  const checkScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeftBtn(el.scrollLeft > 0);
    setShowRightBtn(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);
    return () => {
      el.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <>
        <div className="container">
            <HeadingTop title="Categories" />
            <div className="tabstrip">
                {showLeftBtn && (
                <button onClick={scrollLeft}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                        <circle cx="13.9139" cy="13.9139" r="13.9139" transform="matrix(4.37114e-08 1 1 -4.37114e-08 1.98828 0.916138)" fill="#57CC99"/>
                        <path d="M15.7178 0C23.9982 0.00878906 30.709 6.71953 30.7178 15C30.7178 23.284 24.0018 30 15.7178 30C7.43379 30 0.717773 23.284 0.717773 15C0.717773 6.71602 7.43379 0 15.7178 0ZM15.7178 27.4998C22.6213 27.4998 28.2176 21.9035 28.2176 15C28.2176 8.09648 22.6213 2.5002 15.7178 2.5002C8.81719 2.50781 3.22559 8.09941 3.21797 15C3.21797 21.9035 8.81426 27.4998 15.7178 27.4998Z" fill="#57CC99"/>
                        <path d="M8.9495 16.8751L14.2537 22.5001L16.0209 20.6257L11.9672 16.3257H23.2178V13.6745H11.9672L16.0209 9.3745L14.2537 7.50012L8.9495 13.1251C7.97387 14.1611 7.97387 15.8391 8.9495 16.8751Z" fill="white"/>
                    </svg>
                </button>
                )}
                <ul ref={scrollRef}>
                {tabCategory.map((tab, index) => (
                    <li
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`${
                        activeTab === index
                        ? "active"
                        : ""
                    }`}
                    >
                    {tab.name}
                    </li>
                ))}
                </ul>
                {showRightBtn && (
                <button onClick={scrollRight}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <circle cx="14.8156" cy="14.83" r="13.9139" transform="rotate(90 14.8156 14.83)" fill="#57CC99"/>
                        <path d="M15 0C6.71953 0.00878906 0.00878906 6.71953 0 15C0 23.284 6.71602 30 15 30C23.284 30 30 23.284 30 15C30 6.71602 23.284 0 15 0ZM15 27.4998C8.09648 27.4998 2.5002 21.9035 2.5002 15C2.5002 8.09648 8.09648 2.5002 15 2.5002C21.9006 2.50781 27.4922 8.09941 27.4998 15C27.4998 21.9035 21.9035 27.4998 15 27.4998Z" fill="#57CC99"/>
                        <path d="M21.7683 16.8751L16.4641 22.5001L14.6968 20.6257L18.7505 16.3257H7.5L7.5 13.6745H18.7505L14.6968 9.3745L16.4641 7.50012L21.7683 13.1251C22.7439 14.1611 22.7439 15.8391 21.7683 16.8751Z" fill="white"/>
                    </svg>
                </button>
                )}
            </div>
        </div>
            
        {/* Tab Content */}
        <div className="tab-content">
            <div className="part">
               {tabCategory[activeTab].image}
            </div>
            <div className="part">
                <p className="head">{tabCategory[activeTab].name}</p>
                <p>{tabCategory[activeTab].desc}</p>
            </div>
            <div className="part">
                <p className="head">{tabCategory[activeTab].head2nd}</p>
                {tabCategory[activeTab].list}
                <Link to={tabCategory[activeTab].link}>Explore Problems</Link>
            </div>
        </div>
    </>
  );
};

export default PracticeCategories;
