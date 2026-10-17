import React, { useEffect } from 'react'

const Pagetitle = ({title}) => {

  useEffect(()=>{
    document.title = title;
  } , [title])
  return null;

}

export default Pagetitle
