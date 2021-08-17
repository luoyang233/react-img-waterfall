import React, {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactElement
} from 'react'
import { throttle } from '../utils/throttle'

interface Props {
  children: ReactElement | ReactElement[]
  col?: number
  width?: number
  marginH?: number
  marginV?: number
  bufferHeight?: number
  wrapClass?: string
  concurrent?: number
  extraItemHeight?: number
}

const Waterfall: FC<Props> = props => {
  const {
    marginH = 10,
    marginV = 10,
    bufferHeight = 0,
    col = 3,
    width = 200,
    concurrent = 10,
    extraItemHeight = 0,
    wrapClass,
    children
  } = props
  const loadingRef = useRef(false)
  const containerRef = useRef<any>()
  const [end, setEnd] = useState(0)
  const cols = useMemo(
    () =>
      Array(col)
        .fill('')
        .map(() => ({
          height: 0,
          items: []
        })),
    [col, children]
  )

  const getLowestCol = () => {
    const minH = Math.min(...cols.map(c => c.height))
    const col = cols.find(c => c.height === minH)
    return col
  }

  const insert = (node: ReactElement, img: ImageData) => {
    const col = getLowestCol()
    col.items.push(node)
    col.height += img.width
      ? img.height * (width / img.width) + marginV + extraItemHeight
      : 0
    setEnd(n => n + 1)
  }

  const getImgUrl = (node: ReactElement): string => {
    if (node == null) {
      return null
    }
    if (Array.isArray(node)) {
      const n = node.find(n => getImgUrl(n) != null)
      return n?.props.src
    }
    if (node.type === 'img') {
      return node.props.src
    } else {
      return getImgUrl(node.props?.children)
    }
  }

  const isOverflow = () => {
    const minH = Math.min(...cols.map(c => c.height))
    const { clientHeight, scrollTop } = containerRef.current
    const currentH = clientHeight + bufferHeight + scrollTop
    if (minH >= currentH) {
      return true
    } else {
      return false
    }
  }

  const round = async () => {
    if (!Array.isArray(children)) {
      return
    }

    loadingRef.current = true

    const queue = new Array<Promise<any>>()
    const load = (url: string) => {
      return new Promise(resolve => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = () => resolve(img)
      })
    }

    children.slice(end, end + concurrent).forEach(node => {
      queue.push(load(getImgUrl(node as ReactElement)))
    })

    for (let j = 0; j < queue.length; j++) {
      const img = await queue[j]
      const node = children[end + j]
      insert(node as ReactElement, img)
    }

    loadingRef.current = false
  }

  useEffect(() => {
    setEnd(0)
  }, [cols])

  useEffect(() => {
    if (!isOverflow() && !loadingRef.current) {
      round()
    }
  }, [end])

  const handleScroll = (e: any) => {
    if (loadingRef.current) {
      return
    }
    if (!isOverflow()) {
      round()
    }
  }

  const cloneElement = (node: ReactElement, index?: number): ReactElement => {
    if (index != null && typeof node !== 'string') {
      return React.cloneElement(
        node,
        {
          ...node.props,
          style: { width, marginTop: marginV, ...node.props.style },
          key: node.key ?? index
        },
        React.Children.map(node.props.children, child => {
          return cloneElement(child)
        })
      )
    }
    if (node.type === 'img') {
      return React.cloneElement(node, {
        style: { objectFit: 'contain', width: '100%', ...node.props.style }
      })
    }
    if (node.props?.children) {
      return React.Children.map(node.props.children, child =>
        cloneElement(child)
      )
    }
    return node
  }

  return (
    <div
      className={wrapClass}
      style={{
        display: 'flex',
        overflow: 'auto'
      }}
      onScroll={throttle(handleScroll)}
      ref={containerRef}
    >
      {Array.isArray(children)
        ? cols.map((col, i) => (
            <div key={i} style={{ marginLeft: marginH, width }}>
              {col.items.map((node, i) => cloneElement(node, i))}
            </div>
          ))
        : children}
    </div>
  )
}

export default Waterfall
