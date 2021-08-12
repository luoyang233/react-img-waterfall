import React, { FC } from "react";
import WaterfallComp from "./Waterfall.comp.js";
import WaterfallView from "./Waterfall.view.js";

enum Mode {
  View = "view",
  Component = "component"
}

interface Props {
  col?: number;
  width?: number | string;
  mode?: Mode;
  marginH?: number | string;
  marginV?: number | string;
  source?: string[];
  bufferHeight?: number;
  wrapClass?: string;
  containerHeight?: string;
  once?: number;
}

const WaterfallStrategy = {
  [Mode.View]: WaterfallView,
  [Mode.Component]: WaterfallComp
};

const Waterfall: FC<Props> = (props) => {
  const {
    mode = Mode.Component,
    marginH = 10,
    marginV = 10,
    bufferHeight = 0,
    col = 3,
    width = 200,
    children,
    once = 100,
    ...others
  } = props;
  const comp = WaterfallStrategy[mode];
  return React.createElement(
    comp,
    { marginH, marginV, bufferHeight, width, col, once, ...others },
    children
  );
};

export default Waterfall;
