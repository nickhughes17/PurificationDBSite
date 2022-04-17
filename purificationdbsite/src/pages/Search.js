import React from 'react';
import { useState } from 'react';
import { Table } from '../components/Table';
import { HeaderBar } from '../components/HeaderBar'


export const Search = () => {
  const [ headers, setHeaders ] = useState([]);
  const [ rows, setRows ] = useState([]);
  const [ searchParams, setSearchParams ] = useState("");
  const [ errorText, setErrorText ] = useState("");
  const [selectedDatabaseToSearch, setSelectedDatabaseToSearch] = useState("database1");
  const [ resultLength, setResultLength ] = useState(0);
  const ROWS_PER_PAGE = resultLength + 1;

    const searchDatabase = () => {
        //clear rows
        setRows([]);
        if(searchParams !== ""){
          if(selectedDatabaseToSearch !== ""){
            setErrorText("");
            fetch(`http://localhost:5000/search?offset=${0}&rowsPerPage=${ROWS_PER_PAGE}&searchParams=${searchParams}&databaseToSearch=${selectedDatabaseToSearch}`).then((res) => {
              res.json().then((responseData) => {
                setHeaders(responseData.headers);
                setRows(responseData.rows);
                setResultLength(responseData.queryLength);
              });
            })
          } else {
            setErrorText("Please select a database to search.");
          }
        } else  if (searchParams == ""){
            setErrorText("Sorry, your search needs more information.");
        }
      }
    
      const handleSearchChange = (e) => {
          setSearchParams(e.target.value.toLowerCase());
      }
      
      const handleRadioChange = (e) => {
          setSelectedDatabaseToSearch(e.target.value);
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
            <input type="radio" 
                value="protein" 
                name="selection" 
                checked={selectedDatabaseToSearch === "protein"}
                onChange={handleRadioChange}
                />Protein Name
            <input type="radio" 
                value="sequence" 
                name="selection" 
                onChange={handleRadioChange}
                checked={selectedDatabaseToSearch === "sequence"} 
                />Sequence
            <input type="radio" 
                value="uniprot" 
                name="selection" 
                onChange={handleRadioChange}
                checked={selectedDatabaseToSearch === "uniprot"} 
            />UniProt
        </div>
        <div className="error-text">{errorText}</div>
        <div className="table-container">
            <Table headers={headers} rows={rows}></Table>
        </div>
    </div>
  )
}