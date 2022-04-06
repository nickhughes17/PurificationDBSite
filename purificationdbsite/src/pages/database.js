import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Database = () => {
    const [ pageNumber, setPageNumber ] = useState(1);

    const pageBack = () => {
        setPageNumber(pageNumber - 1);
    }
    const pageForwards = () => {
        setPageNumber(pageNumber + 1);
    }

  return (
    <div>
        <Link to="/Home">Home</Link>
        <div id="table-refresh" className="table-refresh" data-url="/data"></div>
        <button id="prevBtn" onClick={pageBack}>Previous 10</button>
        <span id="pageNumber">{pageNumber}</span>
        <button id="nextBtn" onClick={pageForwards}>Next 10</button>
    </div>
  )
}
