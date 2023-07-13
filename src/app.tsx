// @ts-ignore
import { Random } from 'mockjs'
import React, { useState } from 'react'
import Waterfall from './components/Waterfall'
import './app.css'

const randomImg = () => {
  return Array(100)
    .fill('')
    .map((_, i) =>
      Random.image(
        `${Math.floor(Math.random() * 500)}x${Math.floor(Math.random() * 500)}`,
        `#FF6600&text=${i + 1}`
      )
    )
}

export default function App() {
  const [source, setSource] = useState<string[]>(randomImg())

  const change = () => {
    setSource(randomImg())
  }

  const insert = () => {
    setSource([Random.image(`200x200`, '#FF0000'), ...source])
  }

  const remove = () => {
    setSource(source.slice(1))
  }

  return (
    <>
      <button onClick={insert}>insert</button>
      <button onClick={remove}>remove</button>
      <button onClick={change}>change</button>
      <Waterfall data={source} wrapClass="container" col={3}>
        {source.map((url, i) => (
          <img src={url} key={i} alt={url} />
        ))}
      </Waterfall>
    </>
  )
}
