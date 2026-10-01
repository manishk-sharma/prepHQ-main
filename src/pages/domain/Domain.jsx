import DomainContactForm from "../../components/DomainContactForm";
import Hero from "./sections/hero-section/hero";
import WhatIs from "./sections/what-is/WhatIs";
import LearningResources from "./sections/learning-section/LearningResources";
import Tools from "./sections/tools-section/Tools";

const Domain = ({data}) => {
  return (
   <>
      {data?.heroData && <Hero data={data?.heroData} />}
      {data?.whatIsData && <WhatIs data={data?.whatIsData} />} 
      {data?.resourceCards && <LearningResources data={data?.resourceCards} />}
      {data?.toolsData && <Tools data={data?.toolsData} />}
      <DomainContactForm />
   </>
  );
};
export default Domain;
