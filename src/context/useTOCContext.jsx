import { createContext, useContext, useState } from "react";


export const TOCContext = createContext(null);


export const TOCProvider = ({ children }) => {

  const [isTOCOpen, setIsTOCOpen] = useState(true);
  
  return (
    <TOCContext.Provider value={{ isTOCOpen, setIsTOCOpen }}>
      {children}
    </TOCContext.Provider>
  );
};


// export const useTOC = () => useContext(TOCContext);

export const useTOC = () => {
  const context = useContext(TOCContext);
  if (!context) {
    throw new Error("useTOC must be used inside TOCProvider");
  }
  return context;
};
