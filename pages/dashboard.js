import React, { useState } from "react";
import Router from "next/router";
import { removeToken } from "../lib/token";

import axios from 'axios';
export default function Dashboard() {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  // Watchers
  React.useEffect(() => {
    const token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
    if (!token) {
      redirectToLogin();
    }
  }, []);

  function redirectToLogin() {
    Router.push("/auth/login");
  }

  function handleSearch(value){
// creating an Axios instance
if(value == "")
{
  value=null;
}
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});
// Setting the default headers
axiosInstance.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem("token");
axiosInstance.get(`/api/jobs?search=${value}`)
.then(function (response) {
  console.log(response);

   console.log(response)
   setData(response.data.jobs)
})
.catch(function (error) {
  console.log(error);
});
  }

  function handleLogout(e) {
    e.preventDefault();

    removeToken();
    redirectToLogin();
  }

  return (
    <>
    <nav className="navbar navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Welcome User!
        </a>
        <button
          className="btn btn-info"
          type="button"
          style={{ color: "white", backgroundColor: "#0d6efd" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
   

<center><div style={{ width:"80% !important"}} className="flex flex-1 flex-col p-4 md:p-6">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={'search job'}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
   
    </div>
    <h5> Search Results</h5>
  
    <table class="table table-striped" style={{ width: 700 }}>
    <thead class="thead-light">
                    <tr>
                    <th>Job Title</th>
                    <th>Company Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((rowContent, rowID) => (
                      <tr><td>{rowContent.job_name}</td>
                      <td>{rowContent.company_name}</td>
                      </tr>
  
                    ))}
                </tbody>
            </table>

    </center>
  </>
  );
}

