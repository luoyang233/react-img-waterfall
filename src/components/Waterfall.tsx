import React, {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactElement,
  UIEventHandler
} from 'react'

interface Props {
  children: ReactElement | ReactElement[]
  data?: any
  col?: number
  width?: number
  marginH?: number
  marginV?: number
  bufferHeight?: number
  wrapClass?: string
  concurrent?: number
  extraItemHeight?: number
  onScroll?: UIEventHandler<HTMLDivElement>
  onComplete?: () => void
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
    children,
    data = true,
    onScroll,
    onComplete
  } = props
  const [end, setEnd] = useState(0)
  const [items, setItems] = useState([])
  const loadingRef = useRef(false)
  const containerRef = useRef<any>()
  const { current: rootMap } = useRef(new Map())
  const rebuildRef = useRef(Symbol())
  const colsH = useMemo(() => Array(col).fill(0), [data])

  useEffect(() => {
    setEnd(0)
    setItems([])
    rebuildRef.current = Symbol()
    loadingRef.current = false
    rootMap.clear()
  }, [data])

  useEffect(() => {
    build()
  }, [end])

  const getLowestCol = () => {
    const min = Math.min(...colsH)
    const index = colsH.findIndex(h => h === min)
    return index
  }

  const insert = (node: ReactElement, img: ImageData) => {
    const index = getLowestCol()
    const top = colsH[index]
    const left = index * (width + marginH)
    const item = { node, position: [top, left] }
    const height = img.width
      ? img.height * (width / img.width) + marginV + extraItemHeight
      : 0
    colsH[index] += height
    setItems(items => [...items, item])
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
    const minH = Math.min(...colsH)
    const { clientHeight, scrollTop } = containerRef.current
    const currentH = clientHeight + bufferHeight + scrollTop

    return minH >= currentH
  }

  const build = async () => {
    if (loadingRef.current) return
    if (!Array.isArray(children)) return
    if (end === children.length) {
      onComplete && onComplete()
      return
    }
    if (isOverflow()) return

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

    const syb = rebuildRef.current
    for (let j = 0; j < queue.length; j++) {
      const img = await queue[j]
      if (rebuildRef.current !== syb) return
      const node = children[end + j]
      insert(node as ReactElement, img)
    }

    loadingRef.current = false
  }

  const handleScroll: UIEventHandler<HTMLDivElement> = e => {
    onScroll && onScroll(e)
    build()
  }

  const cloneElement = (node: ReactElement, index?: number): ReactElement => {
    const isRoot = index != null && typeof node !== 'string'
    if (isRoot) {
      const key = node.key ?? index
      const cache = rootMap.get(node.key)
      if (cache) return cache
      const root = React.cloneElement(
        node,
        {
          ...node.props,
          style: { width, ...node.props.style },
          key
        },
        React.Children.map(node.props.children, child => {
          return cloneElement(child)
        })
      )
      rootMap.set(root.key, root)
      return root
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
        position: 'relative',
        overflow: 'auto'
      }}
      onScroll={handleScroll}
      ref={containerRef}
    >
      {Array.isArray(children)
        ? items.map((item, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: item.position[0],
                left: item.position[1]
              }}
            >
              {cloneElement(item.node, i)}
            </div>
          ))
        : children}
    </div>
  )
}

export default Waterfall
