// @ts-ignore
import { Random } from 'mockjs';
import React, { useEffect, useState } from 'react';
import Waterfall from './components/Waterfall';
import './app.css';

const randomImg = () => {
  return Array(20)
    .fill('')
    .map((_, i) =>
      Random.image(`${Math.floor(Math.random() * 200)}x${Math.floor(Math.random() * 50)}`, `#FF6600&text=${i + 1}`)
    );
};

export default function App() {
  const [source, setSource] = useState<string[]>(randomImg());
  const ref = React.useRef<any>();

  const change = () => {
    setSource(randomImg());
    ref.current.reload();
  };

  const push = () => {
    setSource(s => [...s, Random.image(`200x200`, '#FF0000')]);
  };

  return (
    <>
      <button onClick={push}>push</button>
      <button onClick={change}>change</button>
      <Waterfall wrapClass="container" col={3} ref={ref}>
        {source.map((url, i) => (
          <img src={url} key={i} alt={url} />
        ))}
      </Waterfall>
    </>
  );
}
