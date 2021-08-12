import { Random } from "mockjs";
import React, { useMemo, useReducer, useState } from "react";
import Waterfall from "./components";

export default function App() {
  const [col, setCol] = useState(3);
  const [_, change] = useReducer((s) => s + 1, 0);
  const source = useMemo(
    () =>
      Array(100)
        .fill("")
        .map((_, i) =>
          Random.image(
            `${Math.floor(Math.random() * 500)}x${Math.floor(
              Math.random() * 500
            )}`,
            "#FF6600"
          )
        ),
    [_]
  );
  
  return (
    <>
      <button onClick={() => setCol(col - 1)}>col-1</button>
      <button onClick={() => setCol(col + 1)}>col+1</button>
      <button onClick={change}>change</button>
      <Waterfall wrapClass="container" col={col}>
        {source.map((url, i) => (
          <div
            key={url + i}
            style={{
              height: url.match(/(?<=\d+x)\d+(?=\/)/)[0] + "px",
              backgroundColor: "red"
            }}
          >
            {i}
          </div>
          // <img
          //   key={i}
          //   style={{ height: Math.random() * 500 }}
          //   src={url}
          //   alt=""
          // />
        ))}
      </Waterfall>
    </>
  );
}
