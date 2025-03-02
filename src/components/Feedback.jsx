import React, { useState, useEffect } from 'react';
import style from '../modules/Feedback.module.css';

function Feedback({ messaggio, positivo }) {
  const [visibile, setVisibile] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibile(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visibile) return null;


  return (
    <div className={positivo ? style.positiveMsg : style.negativeMsg}>
      <p 
      className={style.msg}>
        {messaggio}</p>
    </div>
  );
}

export default Feedback;