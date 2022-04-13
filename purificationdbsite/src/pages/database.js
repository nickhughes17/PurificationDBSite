import React, { useEffect } from 'react';
import { useState } from 'react';
import { Table } from '../components/Table';
import { HeaderBar } from '../components/HeaderBar'


export const Database = () => {
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ headers, setHeaders ] = useState([]);
  const [ rows, setRows ] = useState([]);
  const MAX_PAGE_NUMBER = 100;
  const ROWS_PER_PAGE = 10;


    const pageBack = () => {
      if(pageNumber > 1){
        setPageNumber(pageNumber - 1);
        //load page
      }
    }
    const pageForwards = () => {
      if(pageNumber < MAX_PAGE_NUMBER){
        setPageNumber(pageNumber + 1);
        //loag page
      }
    }

    useEffect(() => {
      fetch(`http://localhost:5000/rows?offset=${(pageNumber-1)*ROWS_PER_PAGE}&rowsPerPage=${ROWS_PER_PAGE}`).then((res) => {
        res.json().then((responseData) => {
          setHeaders(responseData.headers)
          setRows(responseData.rows);
        });
        
      })
    }, [pageNumber]);


  return (
    <div>
        <HeaderBar currentPage={"Database"}></HeaderBar>
        <div className="table-container">
          <Table headers={headers} rows={rows}></Table>
        </div>
        <button id="prevBtn" onClick={pageBack}>Back 10</button>
        <span id="pageNumber">{pageNumber}</span>
        <button id="nextBtn" onClick={pageForwards}>Next 10</button>
    </div>
  )
}
