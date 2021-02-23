<template>
  <div>
    <div class="diagram-tree-node-label" @click="clickNode(tree)">
      <div :class="tree.type">
        <div
          class="title"
          :style="{
            'background-color':
              others.filter((v) => {
                return v.name == tree.type;
              }).length > 0
                ? others.filter((v) => {
                    return v.name == tree.type;
                  })[0].color
                : options.filter((v) => {
                    return v.name == tree.type;
                  }).length > 0
                ? options.filter((v) => {
                    return v.name == tree.type;
                  })[0].color
                : '',
          }"
        >
          <template v-if="tree.type == 'task-node'">
            <div>
              {{ tree.title }}
            </div>
            <div>优先级{{ tree.index }}</div>
          </template>
          <span v-else>
            {{
              options.filter((v) => {
                return v.name == tree.type;
              }).length > 0
                ? options.filter((v) => {
                    return v.name == tree.type;
                  })[0].title
                : others.filter((v) => {
                    return v.name == tree.type;
                  }).length
                ? others.filter((v) => {
                    return v.name == tree.type;
                  })[0].title
                : ""
            }}
          </span>
        </div>
        <div class="content">
          <template v-if="tree.type == 'task-node' && tree.factor.length > 0">
            {{ tree.factor.join(";") }}
          </template>
          <template
            v-else-if="tree.type == 'task-node' && tree.factor.length == 0"
          >
            请设置条件
          </template>
          <span v-else>
            {{ tree[tree.type].join("，") }}
          </span>
        </div>
        <div class="add">
          <button @click.stop="showOption($event, tree)">
            <span class="iconfont icon-add"></span>
          </button>
        </div>
        <div v-if="tree.children && tree.children.length > 1" class="factor">
          <button @click.stop="addNode(tree)">添加条件</button>
        </div>
        <div class="delete" v-if="tree.id != '1'">
          <span
            class="iconfont icon-dustbin_icon"
            @click.stop="deleteNode(tree)"
          ></span>
        </div>
      </div>
    </div>
    <div
      v-if="tree.children && tree.children.length > 0"
      class="diagram-tree-node-children"
    >
      <div
        v-for="(item, index) in tree.children"
        :key="index"
        class="diagram-tree-node"
        :class="{
          'is-leaf':
            !item.hasOwnProperty('children') || item.children.length == 0,
        }"
      >
        <Node
          :tree="item"
          :options="options"
          :others="others"
          :factor="factor"
          @clickNode="clickNode"
          @showOption="showOption"
          @deleteNode="deleteNode"
          @addNode="addNode"
        ></Node>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Node",
  props: {
    tree: {
      type: Object,
    },
    options: {
      type: Array,
    },
    others: {
      type: Array,
    },
    factor: {
      tpye: Object,
    },
  },
  data() {
    return {};
  },
  components: {},

  methods: {
    // 点击编辑
    clickNode(tree) {
      this.$emit("clickNode", tree);
    },
    // 点击打开添加选项框
    showOption(e, tree) {
      this.$emit("showOption", e, tree);
    },
    // 添加条件
    addNode(tree) {
      this.$emit("addNode", tree);
    },
    // 删除节点
    deleteNode(tree) {
      this.$emit("deleteNode", tree);
    },
  },
};
</script>

<style scoped>
@import "./font/iconfont.css";
.diagram-tree-node,
.diagram-tree-node-children {
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.diagram-tree-node {
  padding-top: 40px;
  display: table-cell;
  vertical-align: top;
}
.diagram-tree-node:after,
.diagram-tree-node:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 39px;
  transition: all 0.35s;
}
.diagram-tree-node:after {
  left: 50%;
  border-left: 1px solid #ddd;
}
.diagram-tree-node:not(:first-child):before,
.diagram-tree-node:not(:last-child):after {
  border-top: 1px solid #ddd;
}
.diagram-tree-node-label {
  position: relative;
  display: inline-block;
  width: 190px;
  min-height: 60px;
  box-shadow: 0 1px 5px #00000026;
  border-radius: 5px;
  cursor: pointer;
}
.diagram-tree-node-label > div {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.diagram-tree-node-label > div .add {
  z-index: 89;
  position: absolute;
  bottom: -13px;
  left: 50%;
  width: 26px;
  height: 26px;
  line-height: 26px;
  margin: 0 0 0 -12.5px;
  padding: 0;
}
.diagram-tree-node-label > div .add button {
  width: 26px;
  height: 26px;
  line-height: 26px;
  background-color: #0059ff;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
}
.diagram-tree-node-label > div .add button span {
  font-size: 12px;
}
.diagram-tree-node-label > div .delete {
  display: none;
  z-index: 89;
  position: absolute;
  top: 0px;
  right: 0px;
  width: 100%;
  height: 25px;
  line-height: 25px;
  padding: 0;
  cursor: pointer;
  text-align: center;
}
.diagram-tree-node-label > div .delete span {
  color: #e6e6e6;
  font-size: 12px;
}
.diagram-tree-node-label > div .delete span:hover {
  color: #fff;
}
.diagram-tree-node-label > .task-node .delete span {
  color: #0059ff;
  font-size: 12px;
}
.diagram-tree-node-label > .task-node .delete span:hover {
  color: #4a89ff;
}
.diagram-tree-node-label > div .add button:hover {
  background-color: #3b7ffd;
}
.diagram-tree-node-label > div .factor {
  z-index: 89;
  position: absolute;
  bottom: -53px;
  left: 50%;
  width: 90px;
  height: 26px;
  line-height: 26px;
  margin: 0 0 0 -45px;
  padding: 0;
}
.diagram-tree-node-label > div .factor button {
  width: 90px;
  height: 26px;
  line-height: 26px;
  background-color: #fff;
  color: #a7a7a7;
  border: 1px solid#a7a7a7;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
}
.diagram-tree-node-label > div .factor button:hover {
  color: #0059ff;
  border: 1px solid #0059ff;
}
.diagram-tree-node-label > div > div {
  padding: 0 15px;
  text-align: left;
}
.diagram-tree-node-label > div > .title {
  height: 25px;
  line-height: 25px;
  color: #fff;
  font-size: 12px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.diagram-tree-node-label > div.task-node > .title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #b9b9b9;
}
.diagram-tree-node-label > div > .content {
  flex: 1;
  min-height: 40px;
  line-height: 40px;
}
.diagram-tree-node-label > div.task-node > .content {
  font-size: 12px;
}
.diagram-tree-node-label:hover {
  border: 1px solid #0077ff;
}
.diagram-tree-node-label:hover .delete {
  display: block;
}
.diagram-tree-node-children {
  padding-top: 40px;
  display: table;
}
.diagram-tree-node-children:before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 40px;
  border-left: 1px solid #ddd;
  transition: all 0.35s;
}
.diagram-tree-node-children:after {
  content: "";
  display: table;
  clear: both;
  transition: all 0.35s;
}
.diagram-tree-node.is-leaf {
  padding-left: 25px;
  padding-right: 25px;
}
</style>
