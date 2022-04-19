import React, { useEffect } from 'react';
import { useState } from 'react';
import { Table } from '../components/Table';
import { HeaderBar } from '../components/HeaderBar'
import { Link, useLocation, useNavigate } from 'react-router-dom';


export const Entry = () => {
    const [ headers, setHeaders ] = useState([]);
    const [ rows, setRows ] = useState([]);
    const location = useLocation();
    let navigate = useNavigate();
    const data = location.state;
    useEffect(() => {
        if(data){
            fetch(`http://localhost:5000/entry?entryparams=${data.entryparams}`).then((res) => {
              res.json().then((responseData) => {
                setHeaders(responseData.headers);
                setRows(responseData.rows);
              });
            })
        }
    }, [])
    
    const handleClick = () => {
        navigate(-1)
    }

    return (
      <div>
          <HeaderBar currentPage={"Search"}></HeaderBar>
          <div className="table-container">
            <Table headers={headers} rows={rows}></Table>
          </div>
          <div className="button-bar">
            <button className='backButton' onClick={handleClick}>Back</button>
          </div>
      </div>
    )
}
