import React from 'react'

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
            {rows.map((row) => {
              return (
                <tr key={row["doi"]}>
                  {Object.values(row).map((val, key) => {
                    return(
                      <td onClick={toggleShow} key={key}>{val}</td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
    </table>
  )
}

