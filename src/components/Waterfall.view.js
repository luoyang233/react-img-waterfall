import React, { useMemo, useEffect, useReducer, useRef } from "react";

const Waterfall = (props) => {
  const {
    col: colNum,
    source,
    width,
    marginH,
    marginV,
    bufferHeight,
    wrapClass,
    containerHeight
  } = props;
  const [_, forceUpdate] = useReducer((s) => s + 1, 0);
  const roundRef = useRef(Symbol());
  const containerRef = useRef();
  const cols = useMemo(
    () =>
      Array(colNum)
        .fill("")
        .map(() => ({
          height: 0,
          urls: []
        })),
    [colNum, source]
  );

  useEffect(() => {
    roundRef.current = Symbol();
  }, [source, cols]);

  useEffect(() => {
    const getLowestColIndex = () => {
      const minH = Math.min(...cols.map((c) => c.height));
      const index = cols.findIndex((c) => c.height === minH);
      return index;
    };

    const layoutImg = (img) => {
      const index = getLowestColIndex();
      cols[index].urls.push(img.src);
      cols[index].height += img.width ? img.height * (width / img.width) : 0;
      forceUpdate();
    };

    const isOverflow = () => {
      const minHeight = Math.min(...cols.map((c) => c.height));
      const { clientHeight, scrollTop } = containerRef.current;
      const loadHeight = clientHeight + bufferHeight + scrollTop;
      if (minHeight >= loadHeight) {
        return true;
      } else {
        return false;
      }
    };

    let concurrent = 0;
    const MAX_CONCURRENT = 5;
    const sourceCopy = [...source];
    const round = roundRef.current;
    const next = () => {
      const abort = round !== roundRef.current;
      const load = sourceCopy.length && !abort && !isOverflow();
      if (!load) {
        return;
      }
      if (concurrent >= MAX_CONCURRENT) {
        return;
      }
      concurrent++;
      const url = sourceCopy.shift();
      const img = new Image();
      img.src = url;
      img.onload = () => {
        concurrent--;
        layoutImg(img);
        next();
      };
      img.onerror = () => {
        concurrent--;
        next();
      };
      next();
    };

    next();

    const containerDom = containerRef.current;
    containerDom.addEventListener("scroll", next);
    return () => {
      containerDom.removeEventListener("scroll", next);
    };
  }, [source, cols]);

  return (
    <div
      className={wrapClass}
      ref={containerRef}
      style={{
        display: "flex",
        marginLeft: -marginH,
        height: containerHeight,
        overflow: "auto"
      }}
    >
      {cols.map((col, i) => (
        <div
          key={i}
          style={{ marginLeft: marginH, marginTop: -marginV, width }}
        >
          {col.urls.map((url, i) => (
            <img
              src={url}
              key={i}
              style={{ width, objectFit: "contain", marginTop: marginV }}
              alt=""
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Waterfall;
