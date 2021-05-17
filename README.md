# vue-diagram-tree

# 前言

> > 最近公司项目（Vue）需求有用到 树状结构图 ，所以呢我去网上找了很多插件，都不是很符合我的要求。
> > 自己也根据业务需求重新做了一个插件，打包上传到了 npm，若有不妥之处请敬请指出！！

## 插件安装

```
npm install vue-diagram-tree -S
```

## 插件使用

```
<diagram-tree
  :data="data"
  :options="options"
  :others="others"
  @changeNode="changeNode"
  @clickNode="clickNode"
></diagram-tree>
```

#### 引入组件

```
data(){
  data:{
    id: "1",
    name: "founder",
    title: "创始人",
    color: "#3c3fff",
    content: "pafu",
    ...
    children: [],
  },
  options:[
    {
      name: "branch",
      title: "添加分支",
      type: "branch",
      color: "#6fe44c",
      ...
    },
  ],
  others = [
    {
      name: "founder",
      title: "创始人",
      color: "#3c3fff",
      ...
    },
  ]
},
methods: {
  // 点击节点
  clickNode(data) {
    console.log(data);
  },
  // 数据变化
  changeNode(data) {
    this.data = data;
  },
}
```

#### clickNode 点击节点 changeNode 数据变化

## API

### diagram-tree

|   属性   | 简介      | 默认值
| :------: | :-------:|:-------
|  data    | 数据    | (Object){id: "1",name: "sponsor",content: "pafu",children: [],}
|  options   | 可添加的节点数据 |  (Array)[]
|  others  | 仅暂时用的节点数据 | (Array)[]
|  disabled  | 是否禁用状态，默认为 false | (Boolean)false

### data

|   属性   | 简介                                                                                                            | 必填
| :------: | :-------------------------------------------------------------------------------------------------------------- |  :----
|    id    | 作为标记节点的唯一 id，以树状结构书写 { id: "1" , children : [ {id: "11"]},{id: "12",children: [{id: "121"}} ]}    | 必填
|   name   | 唯一标识 name                                                                                                  |  必填
|  title  | 树状图标题                                                                                                        | 必填
|  type  | 类型,默认为添加直接单子节点(当type='branch'，可添加多子节点)                                                       | 
| color  | 树状图标题颜色                                                                                                | 
| content | 节点内容                                                                                                        |
| children | 子节点                                                                                                          |

### 事件

|   属性          | 简介            | 回调参数
| :-------------: | :------------: |:-------------------|
|    clickNode    | 点击子节点       | Function(data) {}|
|   changeNode   | 数据增减变化     | Function(data) {} |

### 插槽

|   属性          | 简介            | 参数
| :-------------: | :------------: |:-------------------|
|    contnent    | 节点内容       | data.tree |
|   title   | 节点标题     | data.tree |

#### 最后附上 Git 地址：https://github.com/LairPaFu/vue-diagram-tree
