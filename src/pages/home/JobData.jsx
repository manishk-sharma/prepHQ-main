import React from 'react'
import { Link } from "react-router-dom";
import { useJobList } from '../../services/jobsServices';

const fallbackJobs = [
  {
    id: 1,
    position: "Software Tester",
    company: "JForce Solutions",
    experience: { min: "1", max: "3" },
    location: "Noida",
    deadline: "16 July 2025",
    apply_link: "https://job.uctconsulting.com/"
  },
  {
    id: 2,
    position: "Software Tester",
    company: "JForce Solutions",
    experience: { min: "1", max: "3" },
    location: "Noida",
    deadline: "16 July 2025",
    apply_link: "https://job.uctconsulting.com/"
  },
  {
    id: 3,
    position: "Software Tester",
    company: "JForce Solutions",
    experience: { min: "1", max: "3" },
    location: "Noida",
    deadline: "16 July 2025",
    apply_link: "https://job.uctconsulting.com/"
  },
  {
    id: 4,
    position: "Software Tester",
    company: "JForce Solutions",
    experience: { min: "1", max: "3" },
    location: "Noida",
    deadline: "16 July 2025",
    apply_link: "https://job.uctconsulting.com/"
  }
];

const JobData = () => {
  const { data: jobDataitems } = useJobList();
  const displayJobs = (jobDataitems && jobDataitems.length > 0)
    ? jobDataitems.slice(0, 4)
    : fallbackJobs;

  return (
    <>
      <div className="items">
        {displayJobs.map((item, index) => (
          <div className="item" key={item?.id || index}>
            <p className="head">{item.position || "Software Tester"}</p>
            <p className="desc">{item.company || "JForce Solutions"}</p>
            <div className="exp-location">
              <p className="exp">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5.5 2.5V4H10.5V2.5C10.5 1.95 10.05 1.5 9.5 1.5H6.5C5.95 1.5 5.5 1.95 5.5 2.5ZM4 4V2.5C4 1.12 5.12 0 6.5 0H9.5C10.88 0 12 1.12 12 2.5V4H14.5C15.33 4 16 4.67 16 5.5V13.5C16 14.33 15.33 15 14.5 15H1.5C0.67 15 0 14.33 0 13.5V5.5C0 4.67 0.67 4 1.5 4H4ZM1.5 5.5V13.5H14.5V5.5H1.5Z"
                    fill="#748893"
                  />
                </svg>
                {item?.experience?.min || "1"}-{item?.experience?.max || "3"} Years
              </p>
              <p className="location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="12"
                  viewBox="0 0 12 16"
                  fill="none"
                >
                  <path
                    d="M6 0C2.69 0 0 2.69 0 6C0 10.5 6 16 6 16C6 16 12 10.5 12 6C12 2.69 9.31 0 6 0ZM6 8.5C4.62 8.5 3.5 7.38 3.5 6C3.5 4.62 4.62 3.5 6 3.5C7.38 3.5 8.5 4.62 8.5 6C8.5 7.38 7.38 8.5 6 8.5Z"
                    fill="#748893"
                  />
                </svg>
                {item?.location || "Noida"}
              </p>
            </div>
            <div className="bottom-part">
              <p>Application Deadline {item?.deadline || "16 July 2025"}</p>
              <Link to={item?.apply_link || "https://job.uctconsulting.com/"} target="_blank" className="apply-btn">
                Apply
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="btn-group">
        <Link to="https://job.uctconsulting.com/" target="_blank" className="custom-btn">
          Explore All job
        </Link>
      </div>
    </>
  );
};

export default JobData;
