import React from 'react'
import FormSideGirl from "../assets/img/form-side-girl.webp"

const FormSideImage = () => {
  return (
    <div style={{borderRadius: "10px", background: "#D5FFED", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingTop: "60px",}}>
      <img src={FormSideGirl} alt='form side girl image' width="321" height="462" />
    </div>
  )
}

export default FormSideImage
