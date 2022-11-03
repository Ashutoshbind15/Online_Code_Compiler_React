import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./Layout/Navbar";

const defaultCode = `
#include<bits/stdc++.h>
using namespace std;

int main() {
  
  cout << "Hello World";
  return 0;
}
`;

function App() {
  const [submission, setSubmission] = useState(defaultCode);
  const [token, setToken] = useState(null);
  const [output, setOutput] = useState(null);

  const judgeUrl = "https://judge0-ce.p.rapidapi.com";

  const getDataHandler = async () => {
    if (token) {
      const options2 = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_X_RapidAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      };

      fetch(
        `${judgeUrl}/submissions/${token}?base64_encoded=true&fields=*`,
        options2
      )
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setOutput(atob(response.stdout));
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    getDataHandler();
  }, [token]);

  const submissionHandler = async () => {
    const submissionData = {
      language_id: 54,
      source_code: btoa(submission),
    };

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.REACT_APP_X_RapidAPI_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify(submissionData),
    };

    fetch(`${judgeUrl}/submissions?base64_encoded=true&fields=*`, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);

        if (response.token) {
          setToken(response.token);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-start w-full">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={submission}
          className="bg-black text-orange-600 caret-white w-4/5 code resize-x"
          onChange={(e) => {
            setSubmission(e.target.value);
          }}
          autoFocus
        />
        <button
          onClick={() => {
            submissionHandler();
          }}
        >
          Submit
        </button>
      </div>
      {token && <h1>{token}</h1>}
      {output && <h1>{output}</h1>}
    </div>
  );
}

export default App;
