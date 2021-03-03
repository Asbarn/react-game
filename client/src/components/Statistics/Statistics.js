import React, { useEffect, useState } from "react";

const Statistics = () => {
  const [sort, setSort] = useState("moves");

  let stats = [];
  const localStorageStats = JSON.parse(localStorage.getItem("statistics"));
  if (localStorageStats !== null) {
    if (sort === "moves") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stats = localStorageStats.sort((a, b) => {
        if (a.moves < b.moves) return -1;
        if (a.moves > b.moves) return 1;
        return 0;
      });
    } else {
      stats = localStorageStats.sort((a, b) => {
        if (
          parseInt(a.time.minutes, 10) * 60 + a.time.seconds <
          parseInt(b.time.minutes, 10) * 60 + b.time.seconds
        )
          return -1;
        if (
          parseInt(a.time.minutes, 10) * 60 + a.time.seconds >
          parseInt(b.time.minutes, 10) * 60 + b.time.seconds
        )
          return 1;
        return 0;
      });
    }
  }

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <>
      <table>
        <caption>Table of the best 10 results by {sort}</caption>
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Number of moves</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((el, num) => {
            if (num < 10)
              return (
                <tr>
                  <th>{num + 1}</th>
                  <td>{el.moves}</td>
                  <td>
                    <span class="minute">{el.time.minutes}</span>
                    <span>:</span>
                    <span class="second">{el.time.seconds}</span>
                  </td>
                </tr>
              );
          })}
        </tbody>
      </table>
      <div>
        <select value={sort} onChange={handleChange}>
          <option value="moves">Sort by moves</option>
          <option value="time">Sort by time</option>
        </select>
      </div>
    </>
  );
};

export default Statistics;
