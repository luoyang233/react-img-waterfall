import React, { useEffect, useMemo, useReducer, useState } from "react";

const Waterfall = (props) => {
  const { col: colNum, width, marginH, marginV, children, once } = props;
  const [_, forceUpdate] = useReducer((s) => s + 1, 0);
  const [count, setCount] = useState(0);
  const cols = useMemo(
    () =>
      Array(colNum)
        .fill("")
        .map(() => ({
          height: 0,
          items: []
        })),
    [colNum, children, width, marginH, marginV]
  );

  useEffect(() => {
    setCount(0);
  }, [cols]);

  useEffect(() => {
    const getLowestCol = () => {
      const minH = Math.min(...cols.map((c) => c.height));
      const col = cols.find((c) => c.height === minH);
      return col;
    };

    React.Children.forEach(children.slice(count - once, count), (child) => {
      const height = child.props.style.height;
      const col = getLowestCol();
      const heightNumber =
        typeof height === "string" ? Number(height.match(/\d+/)[0]) : height;
      const node = React.cloneElement(child, {
        style: { ...child.props.style, width }
      });

      col.height += heightNumber;
      col.items.push(node);
    });

    if (count < children.length) {
      window.requestAnimationFrame(() => {
        setCount((c) => c + once);
      });
    } else {
      forceUpdate();
    }
  }, [count]);

  return (
    <div style={{ display: "flex", marginLeft: -marginH }}>
      {cols.map((col, i) => (
        <div key={i} style={{ marginLeft: marginH, width }}>
          {col.items.map((item, j) => (
            <div key={j} style={{ marginTop: j && marginV }}>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Waterfall;
