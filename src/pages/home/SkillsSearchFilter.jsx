import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import javascriptImg from "../../assets/img/home/skills/javascript.webp";
import jqueryImg from "../../assets/img/home/skills/jquery.webp";
import angularImg from "../../assets/img/home/skills/angular.webp";
import dsImg from "../../assets/img/home/skills/diagram.webp";
import phpImg from "../../assets/img/home/skills/php.webp";
import cImg from "../../assets/img/home/skills/c-programming.webp";
import csharpImg from "../../assets/img/home/skills/csharp.webp";
import webApiInterviewImg from "../../assets/img/home/skills/web.webp";
import cppImg from "../../assets/img/home/skills/cpp.webp";
import java8Img from "../../assets/img/home/skills/java8.webp";
import kotlinImg from "../../assets/img/home/skills/kotlin.webp";
import swiftImg from "../../assets/img/home/skills/swift.webp";
import rubyOnRailsImg from "../../assets/img/home/skills/ruby-on-rails.webp";
import goImg from "../../assets/img/home/skills/go.webp";
import typescriptImg from "../../assets/img/home/skills/typescript.webp";
import pythonImg from "../../assets/img/home/skills/python.webp";
import rImg from "../../assets/img/home/skills/r-language.webp";
import scalaImg from "../../assets/img/home/skills/scala.webp";
import perlImg from "../../assets/img/home/skills/perl.webp";
import es6Img from "../../assets/img/home/skills/es6.webp";
// import machineLearningImg from "../../assets/img/home/skills/machine-learning.webp";
import deepLearningInterviewImg from "../../assets/img/home/skills/deep-learning-interview.webp";
import numpyImg from "../../assets/img/home/skills/numpy.webp";
import pandasImg from "../../assets/img/home/skills/pandas.webp";
import linearRegressionImg from "../../assets/img/home/skills/machine-learning.webp";
import dataModellingImg from "../../assets/img/home/skills/data-modelling.webp";
import dataWarehouseImg from "../../assets/img/home/skills/data-warehouse.webp";
import sparkImg from "../../assets/img/home/skills/spark.webp";
import pysparkImg from "../../assets/img/home/skills/pyspark.webp";
import systemDesignImg from "../../assets/img/home/skills/system-design.webp";
import restApiImg from "../../assets/img/home/skills/rest-api.webp";
import mysqlImg from "../../assets/img/home/skills/mysql.webp";
import mongodbImg from "../../assets/img/home/skills/mongodb.webp";
import sqlImg from "../../assets/img/home/skills/sql.webp";
import plsqlImg from "../../assets/img/home/skills/plsql.webp";
import oracleDbaImg from "../../assets/img/home/skills/oracle-dba.webp";
import db2Img from "../../assets/img/home/skills/db2.webp";
import snowflakeImg from "../../assets/img/home/skills/snowflake.webp";
import sqlJoinsImg from "../../assets/img/home/skills/sql-joins.webp";
import elasticsearchImg from "../../assets/img/home/skills/elasticsearch.webp";
import shellScriptingImg from "../../assets/img/home/skills/shell-scripting.webp";
import powershellImg from "../../assets/img/home/skills/powershell.webp";
import ansibleImg from "../../assets/img/home/skills/ansible.webp";
import terraformImg from "../../assets/img/home/skills/terraform.webp";
import groovyImg from "../../assets/img/home/skills/groovy.webp";
import htmlImg from "../../assets/img/home/skills/html.webp";
import cssImg from "../../assets/img/home/skills/css.webp";
import figmaImg from "../../assets/img/home/skills/figma.webp";
import adobeXdImg from "../../assets/img/home/skills/adobe-xd.webp";
import bootstrapImg from "../../assets/img/home/skills/bootstrap.webp";
import angularjsImg from "../../assets/img/home/skills/angularjs.webp";
import reactImg from "../../assets/img/home/skills/react.webp";
import vueImg from "../../assets/img/home/skills/vue-js.webp";
import webDesignerImg from "../../assets/img/home/skills/web-designer.webp";
import uxDesignImg from "../../assets/img/home/skills/ux-design.webp";
import aspnetImg from "../../assets/img/home/skills/aspnet.webp";
import laravelImg from "../../assets/img/home/skills/laravel.webp";
import djangoImg from "../../assets/img/home/skills/django.webp";
import nodejsImg from "../../assets/img/home/skills/nodejs.webp";
import reactNativeImg from "../../assets/img/home/skills/react-native.webp";
import fullStackDeveloperImg from "../../assets/img/home/skills/full-stack-developer.webp";
import frontEndDeveloperImg from "../../assets/img/home/skills/front-end-developer.webp";
import webDeveloperImg from "../../assets/img/home/skills/web-developer.webp";
import magento2Img from "../../assets/img/home/skills/magento2.webp";
import wordpressImg from "../../assets/img/home/skills/wordpress.webp";
import softwareTestingImg from "../../assets/img/home/skills/software-testing.webp";
import automationTestingImg from "../../assets/img/home/skills/automation-testing.webp";
import manualTestingImg from "../../assets/img/home/skills/manual-testing.webp";
import performanceTestingImg from "../../assets/img/home/skills/performance-testing.webp";
import loadrunnerImg from "../../assets/img/home/skills/loadrunner.webp";
import seleniumWebdriverImg from "../../assets/img/home/skills/selenium-webdriver.webp";
import jmeterImg from "../../assets/img/home/skills/jmeter.webp";
import uftImg from "../../assets/img/home/skills/uft.webp";
import cucumberImg from "../../assets/img/home/skills/cucumber.webp";
import databaseTestingImg from "../../assets/img/home/skills/database-testing.webp";
import etlTestingImg from "../../assets/img/home/skills/etl-testing.webp";
import functionalTestingImg from "../../assets/img/home/skills/functional-testing.webp";
import regressionTestingImg from "../../assets/img/home/skills/regression-testing.webp";
import mobileTestingImg from "../../assets/img/home/skills/mobile-testing.webp";
import rpaImg from "../../assets/img/home/skills/rpa.webp";
import robotFrameworkImg from "../../assets/img/home/skills/robot-framework.webp";
import devopsImg from "../../assets/img/home/skills/devops.webp";
import dockerImg from "../../assets/img/home/skills/docker.webp";
import kubernetesImg from "../../assets/img/home/skills/kubernetes.webp";
import jenkinsImg from "../../assets/img/home/skills/jenkins.webp";
import cicdImg from "../../assets/img/home/skills/cicd.webp";
import awsImg from "../../assets/img/home/skills/aws.webp";
import azureImg from "../../assets/img/home/skills/azure.webp";
import gcpImg from "../../assets/img/home/skills/gcp.webp";
import openshiftImg from "../../assets/img/home/skills/openshift.webp";
import cloudComputingImg from "../../assets/img/home/skills/cloud-computing.webp";
import sreImg from "../../assets/img/home/skills/sre.webp";
import agileImg from "../../assets/img/home/skills/agile.webp";
import scrumMasterImg from "../../assets/img/home/skills/scrum-master.webp";
import jiraImg from "../../assets/img/home/skills/jira.webp";
import sdlcImg from "../../assets/img/home/skills/sdlc.webp";
import technicalSupportImg from "../../assets/img/home/skills/technical-support.webp";
import applicationSupportImg from "../../assets/img/home/skills/application-support.webp";
import bgpImg from "../../assets/img/home/skills/bgp.webp";
import paloAltoImg from "../../assets/img/home/skills/palo-alto.webp";
import ccnaImg from "../../assets/img/home/skills/ccna.webp";

const SkillsSearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  useEffect(() => {
    setFilterCategory("All");
  }, [searchTerm]);

  const categories = [
  "All",
  "Programming",
  "Data Science",
  "System Design",
  "Databases",
  "Scripting",
  "UI/UX Design",
  "Web Development",
  "Testing",
  "DevOps",
  "Agile & Project Management",
  "Networking & Security"
];

const guidesData = [
  // Top 8 matching screenshot
  { title: "JavaScript", category: "Programming", logo: javascriptImg },
  { title: "jQuery", category: "Programming", logo: jqueryImg },
  { title: "Angular", category: "Programming", logo: angularImg },
  { title: "Data Structure", category: "Programming", logo: dsImg },
  { title: "PHP", category: "Programming", logo: phpImg },
  { title: "C", category: "Programming", logo: cImg },
  { title: "C# Interview", category: "Programming", logo: csharpImg },
  { title: "Web API Interview", category: "Programming", logo: webApiInterviewImg },

  // Programming & Other Guides
  { title: "Python", category: "Programming", logo: pythonImg },
  { title: "AngularJS", category: "UI/UX Design", logo: angularjsImg },
  { title: "React", category: "UI/UX Design", logo: reactImg },
  { title: "DevOps", category: "DevOps", logo: devopsImg },
  { title: "Docker", category: "DevOps", logo: dockerImg },
  { title: "Kubernetes", category: "DevOps", logo: kubernetesImg },
  { title: "C++", category: "Programming", logo: cppImg },
  { title: "Java 8", category: "Programming", logo: java8Img },
  { title: "Vue Js", category: "UI/UX Design", logo: vueImg },
  
  { title: "Kotlin", category: "Programming", logo: kotlinImg },
  { title: "Swift", category: "Programming", logo: swiftImg },
  { title: "Ruby on Rails", category: "Programming", logo: rubyOnRailsImg },
  { title: "Go", category: "Programming", logo: goImg },
  { title: "TypeScript", category: "Programming", logo: typescriptImg },
  { title: "R", category: "Programming", logo: rImg },
  { title: "Scala", category: "Programming", logo: scalaImg },
  { title: "Perl", category: "Programming", logo: perlImg },
  { title: "ES6", category: "Programming", logo: es6Img },

  // Data Science
 
  { title: "Deep Learning Interview", category: "Data Science", logo: deepLearningInterviewImg },
  { title: "NumPY", category: "Data Science", logo: numpyImg },
  { title: "Pandas", category: "Data Science", logo: pandasImg },
  { title: "Linear Regression", category: "Data Science", logo: linearRegressionImg },
  { title: "Data Modelling", category: "Data Science", logo: dataModellingImg },
  { title: "Data Warehouse", category: "Data Science", logo: dataWarehouseImg },
  { title: "Spark", category: "Data Science", logo: sparkImg },
  { title: "Pyspark", category: "Data Science", logo: pysparkImg },

  // System Design
  { title: "System Design", category: "System Design", logo: systemDesignImg },
  { title: "REST API", category: "System Design", logo: restApiImg },

  // Databases
  { title: "MySQL", category: "Databases", logo: mysqlImg },
  { title: "MongoDB", category: "Databases", logo: mongodbImg },
  { title: "SQL", category: "Databases", logo: sqlImg },
  { title: "PL/SQL", category: "Databases", logo: plsqlImg },
  { title: "Oracle DBA", category: "Databases", logo: oracleDbaImg },
  { title: "DB2", category: "Databases", logo: db2Img },
  { title: "Snowflake", category: "Databases", logo: snowflakeImg },
  { title: "SQL Joins", category: "Databases", logo: sqlJoinsImg },
  { title: "Elasticsearch", category: "Databases", logo: elasticsearchImg },

  // Scripting
  { title: "Shell Scripting", category: "Scripting", logo: shellScriptingImg },
  { title: "PowerShell", category: "Scripting", logo: powershellImg },
  { title: "Ansible", category: "Scripting", logo: ansibleImg },
  { title: "Terraform", category: "Scripting", logo: terraformImg },
  { title: "Groovy", category: "Scripting", logo: groovyImg },

  // UI/UX Design
  { title: "HTML", category: "UI/UX Design", logo: htmlImg },
  { title: "CSS", category: "UI/UX Design", logo: cssImg },
  { title: "Figma", category: "UI/UX Design", logo: figmaImg },
  { title: "Adobe XD", category: "UI/UX Design", logo: adobeXdImg },
  { title: "Bootstrap", category: "UI/UX Design", logo: bootstrapImg },

  { title: "Web Designer", category: "UI/UX Design", logo: webDesignerImg },
  { title: "UX Design", category: "UI/UX Design", logo: uxDesignImg },

  // Web Development
  { title: "ASP.NET", category: "Web Development", logo: aspnetImg },
  { title: "Laravel", category: "Web Development", logo: laravelImg },
  { title: "Django", category: "Web Development", logo: djangoImg },
  { title: "Node.js", category: "Web Development", logo: nodejsImg },
  { title: "React Native", category: "Web Development", logo: reactNativeImg },
  { title: "Full Stack Developer", category: "Web Development", logo: fullStackDeveloperImg },
  { title: "Front End Developer", category: "Web Development", logo: frontEndDeveloperImg },
  { title: "Web Developer", category: "Web Development", logo: webDeveloperImg },
  { title: "Magento 2", category: "Web Development", logo: magento2Img },
  { title: "Wordpress", category: "Web Development", logo: wordpressImg },

  // Testing
  { title: "Software Testing", category: "Testing", logo: softwareTestingImg },
  { title: "Automation Testing", category: "Testing", logo: automationTestingImg },
  { title: "Manual Testing", category: "Testing", logo: manualTestingImg },
  { title: "Performance Testing", category: "Testing", logo: performanceTestingImg },
  { title: "LoadRunner", category: "Testing", logo: loadrunnerImg },
  { title: "Selenium WebDriver", category: "Testing", logo: seleniumWebdriverImg },
  { title: "JMeter", category: "Testing", logo: jmeterImg },
  { title: "UFT", category: "Testing", logo: uftImg },
  { title: "Cucumber", category: "Testing", logo: cucumberImg },
  { title: "Database Testing", category: "Testing", logo: databaseTestingImg },
  { title: "ETL Testing", category: "Testing", logo: etlTestingImg },
  { title: "Functional Testing", category: "Testing", logo: functionalTestingImg },
  { title: "Regression Testing", category: "Testing", logo: regressionTestingImg },
  { title: "Mobile Testing", category: "Testing", logo: mobileTestingImg },
  { title: "RPA", category: "Testing", logo: rpaImg },
  { title: "Robot Framework", category: "Testing", logo: robotFrameworkImg },

  // DevOps
  
  { title: "Jenkins", category: "DevOps", logo: jenkinsImg },
  { title: "CI/CD", category: "DevOps", logo: cicdImg },
  { title: "AWS", category: "DevOps", logo: awsImg },
  { title: "Azure", category: "DevOps", logo: azureImg },
  { title: "GCP", category: "DevOps", logo: gcpImg },
  { title: "OpenShift", category: "DevOps", logo: openshiftImg },
  { title: "Cloud Computing", category: "DevOps", logo: cloudComputingImg },
  { title: "SRE", category: "DevOps", logo: sreImg },

  // Agile & Project Management
  { title: "Agile", category: "Agile & Project Management", logo: agileImg },
  { title: "Scrum Master", category: "Agile & Project Management", logo: scrumMasterImg },
  { title: "JIRA", category: "Agile & Project Management", logo: jiraImg },
  { title: "SDLC", category: "Agile & Project Management", logo: sdlcImg },
  { title: "Technical Support", category: "Agile & Project Management", logo: technicalSupportImg },
  { title: "Application Support", category: "Agile & Project Management", logo: applicationSupportImg },

  // Networking & Security
  { title: "BGP", category: "Networking & Security", logo: bgpImg },
  { title: "Palo Alto", category: "Networking & Security", logo: paloAltoImg },
  { title: "CCNA", category: "Networking & Security", logo: ccnaImg }
];


  const filteredGuides = guidesData.filter((guide) => {
    const matchesSearch = guide.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || guide.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedGuides = filteredGuides.slice(0, 8);

  return (
    <section className="skills">
      <div className="container">
        <h2 className="heading">
          Access The Biggest Question Bank{" "}
          <span className="domain-highlight">Focused On Real-World Skills</span>
        </h2>
        <p className="tagline">
          Personalize templates and questions for over 500 job roles.
        </p>
        <div className="guide">
          <div className="guide-filters">
            <div className="filter-group">
              <label>Search</label>
              <div className="search-input-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.02772 17.4985C4.35974 17.4929 0.692038 14.2916 0.0814847 9.93178C-0.495288 5.80903 2.04326 1.74134 6.00373 0.44196C11.0696 -1.21965 16.4376 1.97094 17.3646 7.2154C17.7788 9.55892 17.2915 11.7298 15.9571 13.7011C15.7989 13.935 15.8014 14.0627 16.009 14.2666C17.192 15.4277 18.3562 16.6076 19.5291 17.7794C19.8994 18.1497 20.1021 18.567 19.9482 19.1032C19.7093 19.9371 18.7378 20.2705 18.044 19.7513C17.9277 19.6643 17.8219 19.5624 17.7187 19.4591C16.5608 18.3024 15.3997 17.1488 14.2525 15.9814C14.0685 15.7943 13.9509 15.7818 13.7364 15.9326C12.2425 16.9817 10.5697 17.4766 9.02772 17.4972V17.4985ZM8.77249 15.0292C12.1737 15.048 15.0194 12.2503 15.0382 8.86825C15.0576 5.38112 12.3032 2.56777 8.84755 2.54024C5.24617 2.51084 2.62942 5.4368 2.54246 8.52667C2.43674 12.2753 5.41131 15.043 8.77249 15.0292Z"
                    fill="#6b7280"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Skills/Languages</label>
              <div className="select-wrapper">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
                <svg
                  className="select-chevron"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#1e293b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="guide-grid">
            {filteredGuides.length > 0 ? (
              paginatedGuides.map((guide, index) => (
                <div className="guide-card" key={index}>
                  <div className="guide-logo">
                    <img
                      src={guide.logo}
                      alt={guide.title}
                      className="img-fluid"
                    />
                  </div>
                  <div className="guide-title">{guide.title}</div>
                  <button className="guide-btn" type="button">
                    <span>View Full Guide</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <circle cx="9" cy="9" r="8" stroke="#074568" strokeWidth="1.5" />
                      <path
                        d="M6.5 11.5L11.5 6.5M11.5 6.5H8M11.5 6.5V10"
                        stroke="#074568"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">No results found</div>
            )}
          </div>



          <div className="explore-btn-container">
            <Link
              to="https://prephq.theiotacademy.co/blog/"
              target="_blank"
              className="explore-btn"
            >
              Explore All Guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSearchFilter;
