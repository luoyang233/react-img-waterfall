# react-img-waterfall
可按需加载的React图片瀑布流
[![GitHub stars](https://img.shields.io/github/stars/luoyang233/react-img-waterfall.svg?style=social)](https://github.com/luoyang233/react-img-waterfall/stargazers) [![npm version](https://img.shields.io/npm/v/react-img-waterfall.svg)](https://www.npmjs.com/package/react-img-waterfall)


## 特性

- 约定传入`img`标签
- 无需提前传入图片高度
- 自适应图片大小
- 动态加载瀑布流
- 自定义并发加载数量
- 缓冲高度

![react-img-waterfall](https://github.com/luoyang233/blog/blob/master/images/react-img-waterfall.gif)

[demo](https://codesandbox.io/s/zhong-ji-ban-ben-hvwgk)


## 使用

```
npm i react-img-waterfall
```


### ⚠️重要

约定：**传入`img`标签，并赋予`src`属性**

> 图片插入第几列，由获取到的图片高度计算得到

```jsx
      <Waterfall>
        {source.map((url, i) => (
          <img src={url} key={i} />
        ))}
      </Waterfall>
```

约定：**`img`标签可嵌套在其他节点内，但需唯一**

> 如果子节点中包含多个`img`标签，只取深度优先第一个获取到的img高度，很可能导致高度计算不准确，插入位置错乱的情况

```jsx
      <Waterfall>
        {source.map((url, i) => (
          <div className="item">
            <img src={url} key={i} />
            <div>others</div>
          </div>
        ))}
      </Waterfall>
```

❌ 避免多个img标签

```jsx
    <Waterfall>
      {source.map((url, i) => (
        <div className="item">
          <img src={url} key={i} />
          <div>
            {/* ❌避免一个item中出现多个img标签 */}
            <img src={url2} key={i} />
          </div>
        </div>
      ))}
    </Waterfall>
```


## props

| prop            | 类型           | 默认 | 必要  | 描述                 |
| --------------- | -------------- | ---- | ----- | -------------------- |
| children        | -              | -    | true  | -                    |
| data            | any            | true | false | 数据源               |
| col             | number         | 3    | false | 列数                 |
| width           | number         | 200  | false | item宽度             |
| marginH         | number         | 10   | false | 列左右间隙           |
| marginV         | number         | 10   | false | item上下间隙         |
| bufferHeight    | number         | 0    | false | 缓冲高度             |
| wrapClass       | string         | -    | false | 容器class            |
| concurrent      | number         | 10   | false | 图片加载并发数量     |
| extraItemHeight | number         | 0    | false | item额外参与计算高度 |
| onScroll        | HTMLDivElement | -    | false | 容器滚动事件         |
| onComplete      | Function       | -    | false | 加载完成         |


### `data`

**建议传入**，否则会引起瀑布流内部无法按预期更新的问题

瀑布流内部以`data`属性判断数据源是否变更，请保持`data`与map的数据源一致

```jsx
     	const [source] = useState([url_0, url_1, url_2]);

      <Waterfall data={source}>
        {source.map((url, i) => (
          <img src={url} key={i} alt={url} />
        ))}
      </Waterfall>
```



### `width`

统一宽度，会为每项item设置此宽度，item的高度无需设置

图片加载后会自适应此宽度，默认为`objectFit:'contain'`

如需修改适应方式，直接在`img`标签中修改即可

```jsx
      <Waterfall width={500}>
        {source.map((url, i) => (
          // 每个item的宽度都会设置为500
          <div className="item">
            <img src={url} key={i} />
            <div>others</div>
          </div>
        ))}
      </Waterfall>
```


### `concurrent`

并发数量，即图片一次性加载数量

例如`concurrent={10}`，则图片一次性加载10张，随着向下滚动，触发后续加载，则再次加载10张


### `bufferHeight`

缓冲高度，组件首次会一次性加载`concurrent`张，如果未超过`容器高度`+`缓冲高度`，则会立刻再次加载`concurrent`张


### `extraItemHeight`

额外高度，item默认为img图片提供的高度

item高度 = 图片高度 + `extraItemHeight`

不传入`extraItemHeight`一般不会造成插入顺序的错误，但可能会引起高度计算问题，导致滚动触发加载不准确

```jsx
      <Waterfall extraItemHeight={20}>
        {source.map((url, i) => (
          <div className="item">
            <img src={url} key={i} />
            <div style={{ height: '20px' }}>others</div>
          </div>
        ))}
      </Waterfall>
```
