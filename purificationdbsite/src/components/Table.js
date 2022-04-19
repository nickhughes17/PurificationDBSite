import React from 'react'
import { Link } from 'react-router-dom'

export const Table = ({headers, rows}) => {
  
  const toggleShow = (e) => {
    e.target.classList.toggle("showText");
  }

  return (
    <table>
        <thead>
            <tr>
              {headers.map((header) => {
                  return(
                    <td key={header}>{header}</td>
                  )
              })}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, index) => {
                return (
                  <tr key={row["UniProt"]+index}>
                    {Object.values(row).map((data, index) => {
                      if(Object.keys(row)[index] === "UniProt"){
                          const myData = {
                            entryparams: data
                          }
                          return(
                            <td key={index}><Link to='/Entry' state={myData}>{data}</Link></td>
                          ) 
                        }else {
                          return(
                            <td onClick={toggleShow} key={index}>{data}</td>
                          )
                        }
                      }
                    )}
                  </tr>
                )
              }
            )}
        </tbody>
    </table>
  )
}

