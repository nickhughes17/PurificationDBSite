import React from 'react';
import { useState } from 'react';
import { Table } from '../components/Table';
import { HeaderBar } from '../components/HeaderBar'


export const Search = () => {
  const [ headers, setHeaders ] = useState([]);
  const [ rows, setRows ] = useState([]);
  const [ searchParams, setSearchParams ] = useState("");
  const [ errorText, setErrorText ] = useState("");
  const ROWS_PER_PAGE = 10000;

    const searchDatabase = () => {
        //clear rows
        setRows([]);
        if(searchParams !== ""){
            setErrorText("");
            fetch(`http://localhost:5000/search?offset=${0}&rowsPerPage=${ROWS_PER_PAGE}&searchParams=${searchParams}`).then((res) => {
              res.json().then((responseData) => {
                setHeaders(responseData.headers)
                setRows(responseData.rows);
              });
            })
        } else {
            setErrorText("Sorry, your search needs more information.")
        }
      }
    
      const handleSearchChange = (e) => {
          setSearchParams(e.target.value.toLowerCase())
      }


  return (
    <div>
        <HeaderBar currentPage={"Search"}></HeaderBar>
        <div className='search-bar-container'>
            <input type="text" onChange={handleSearchChange} />
            <button id="searchBtn" onClick={searchDatabase}>SEARCH</button>
        </div>
        <div className="radio-container">
            {/** need to send value of radio button in fetch and search according to which, when getting which query to search through */}
            <input type="radio" value="protein" name="selection" defaultChecked />Protein Name
            <input type="radio" value="sequence" name="selection" />Sequence
            <input type="radio" value="uniprot" name="selection" />UniProt
        </div>
        <div className="error-text">{errorText}</div>
        <div className="table-container">
            <Table headers={headers} rows={rows}></Table>
        </div>
    </div>
  )
}