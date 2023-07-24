"use client";

import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserCard } from "@/components/UserCard";

export default function RandomUserPage() {
  //user = null or array of object
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    // console.log("tasks is changed");
    const strAmount = JSON.stringify(genAmount);
    // console.log(strTasks);
    localStorage.setItem("genAmount", strAmount);
  }, [genAmount]);

  useEffect(() => {
    const strAmount = localStorage.getItem("Amount");
    if (strAmount === null) {
      setGenAmount([1]);
      return;
    }
    const loadedAmount = JSON.parse(strAmount);
    setGenAmount(loadedAmount);
  }, []);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    const cleanedUser = users.map((x) => cleanUser(x));
    setUsers(cleanedUser);
    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users &&
        !isLoading &&
        users.map((n) => (
          <UserCard
            key={n.email}
            name={n.name}
            imgUrl={n.imgUrl}
            address={n.address}
            email={n.email}
          ></UserCard>
        ))}
    </div>
  );
}
