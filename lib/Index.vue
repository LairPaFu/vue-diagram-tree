
<template>
  <div class="diagram-tree-container">
    <div class="diagram-tree">
      <div class="diagram-tree-node">
        <Node
          :tree="data"
          :options="options"
          :others="others"
          :disabled="disabled"
          :copy="copy"
          :copy_arr="copy_arr"
          @clickNode="clickNode"
          @showOption="showOption"
          @deleteNode="deleteNode"
          @addCopyCheck="addCopyCheck"
          @addNode="addNode"
        >
          <template v-slot:content="{ tree }">
            <slot name="content" :tree="tree"></slot>
          </template>
          <template v-slot:title="{ tree }">
            <slot name="title" :tree="tree"></slot>
          </template>
        </Node>
      </div>
    </div>
    <div
      v-if="!disabled"
      v-show="optionShow"
      class="add-option"
      :style="{ height: 60 * (Math.ceil(options / 2) + 1) + 10 + 'px' }"
    >
      <div v-for="(item, index) in options" :key="index">
        <div @click.stop="addProcessEvent(item)">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Node from "./Node";
export default {
  name: "diagram-tree",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          id: 0,
          name: "sponsor",
          content: "pafu",
          children: [],
        };
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    others: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    copy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      index: [],
      checkArray: [],
      selectTree: null,
      optionShow: false,
      save: [],
      copy_arr: [],
      setNode: {},
      parent: null,
      checkIn: false,
      id: 0,
    };
  },
  components: { Node },
  mounted() {
    // 全局点击
    document.addEventListener("click", (e) => {
      let thisClassName = e.target.className;
      if (thisClassName != "add-option") {
        this.optionShow = false;
      }
    });
  },
  methods: {
    // 获取点击node在数组中的位置
    findIndex(arr, id) {
      for (let i = 0; i < arr.length; i++) {
        let v = arr[i];
        if (v.id == id) {
          this.index.push(i);
          this.checkArray = JSON.parse(JSON.stringify(this.index));
        } else {
          this.index.push(i);
          if (v.hasOwnProperty("children") && v.children.length > 0) {
            this.findIndex(v.children, id);
          }
          this.index.splice(this.index.length - 1, 1);
        }
      }
    },
    // id处理
    handleID(arr = this.data) {
      this.id = 0;
      arr.id = 0;
      this.idAdd(arr.children);
    },
    // 节点id修整
    idAdd(arr) {
      for (let i = 0; i < arr.length; i++) {
        this.id++;
        arr[i].id = this.id;
        if (arr[i].children) {
          this.idAdd(arr[i].children);
        }
      }
    },
    // 获得选择node位置数组
    getArray(id) {
      this.checkArray = [];
      this.index = [];
      this.findIndex(this.data.children, id);
      let index = this.checkArray;
      this.checkArray = [];
      this.index = [];
      return index;
    },
    // 点击编辑
    clickNode(tree) {
      this.$emit("clickNode", tree);
    },
    // 点击打开添加选项框
    showOption(e, tree) {
      let event = e.target;
      let left = event.offsetLeft;
      let top = event.offsetTop;
      while (event.offsetParent) {
        event = event.offsetParent;
        left += event.offsetLeft;
        top += event.offsetTop;
      }
      var option = document.getElementsByClassName("add-option")[0];
      var box = document.getElementsByClassName("diagram-tree-container")[0];
      if (this.optionShow) {
        this.optionShow = false;
        this.selectTree = null;
      }
      this.selectTree = tree;
      this.optionShow = true;
      option.style.left = left - box.offsetLeft + 25 + "px";
      option.style.top = top - box.offsetTop + "px";
    },
    // 添加子分支
    addProcessEvent(item) {
      this.optionShow = false;
      if (this.selectTree != null) {
        if (this.selectTree.id == 0) {
          this.handleID();
          let data = JSON.parse(JSON.stringify(this.data));
          let save = JSON.parse(JSON.stringify(data.children));
          data.children = [];
          let set = JSON.parse(JSON.stringify(this.options)).filter((v) => {
            return v.name == item.name;
          })[0];
          this.id++;
          set.id = this.id;
          set.children = save;
          data.children.push(set);
          this.changeNode(data);
        } else {
          this.handleID();
          let index = this.getArray(this.selectTree.id);
          let data = JSON.parse(JSON.stringify(this.data));
          let res = data.children;
          for (let i = 0; i < index.length; i++) {
            if (i >= index.length - 1) {
              res = res[index[i]];
            } else {
              res = res[index[i]].children;
            }
          }
          let set = JSON.parse(JSON.stringify(this.options)).filter((v) => {
            return v.name == item.name;
          })[0];
          this.id++;
          set.id = this.id;
          if (res.hasOwnProperty("children") && res.children.length > 0) {
            let save = JSON.parse(JSON.stringify(res.children));
            set.children = save;
          }
          res.children = [];
          res.children.push(set);
          this.changeNode(data);
        }
      }
    },
    // 添加分支
    addNode(tree) {
      this.optionShow = false;
      let item = JSON.parse(JSON.stringify(this.options)).filter((v) => {
        return v.name == tree.children[0].name;
      })[0];
      this.handleID();
      if (tree.id == 0) {
        let data = JSON.parse(JSON.stringify(this.data));
        this.id++;
        item.id = this.id;
        data.children.push(item);
        this.changeNode(data);
      } else {
        let index = this.getArray(tree.id);
        let data = JSON.parse(JSON.stringify(this.data));
        let res = data.children;
        for (let i = 0; i < index.length; i++) {
          if (i >= index.length - 1) {
            res = res[index[i]];
          } else {
            res = res[index[i]].children;
          }
        }
        this.id++;
        item.id = this.id;
        res.children.push(item);
        this.changeNode(data);
      }
    },
    // 数据改变
    changeNode(data) {
      this.handleID();
      this.$emit("changeNode", data);
    },
    // 删除节点
    deleteNode(tree) {
      let index = this.getArray(tree.id);
      let data = JSON.parse(JSON.stringify(this.data));
      let res = data.children;
      for (let i = 0; i < index.length; i++) {
        if (index.length > 1) {
          if (i < index.length - 2) {
            res = res[index[i]].children;
          } else {
            res = res[index[i]];
            break;
          }
        } else if (index.length == 1) {
          res = data;
        }
      }
      if (tree.type == "task-node" && res.children.length <= 2) {
        if (res.children.findIndex((v) => v.id == tree.id) == 0) {
          if (res.children[1].children) {
            res.children = res.children[1].children;
          } else {
            res.children = [];
          }
        } else {
          if (res.children[0].children) {
            res.children = res.children[0].children;
          } else {
            res.children = [];
          }
        }
      } else {
        res.children.splice(
          res.children.findIndex((v) => v.id == tree.id),
          1
        );
      }
      this.changeNode(data);
    },
    // 添加要复制的节点
    addCopyCheck(tree) {
      if (this.copy_arr.indexOf(tree.id) == -1) {
        this.copy_arr.push(tree.id);
      } else {
        this.copy_arr.splice(this.copy_arr.indexOf(tree.id), 1);
      }
      // let data_arr = [];
      let newData = JSON.parse(JSON.stringify(this.data));
      this.setCopyArr(newData);
      this.handleCopyArr(newData);
      this.adjustCopy(newData);
      // this.getCopyArr(newData, data_arr);
      // // console.log(data_arr);
      // newData.children = [];
      // for (let i = 0; i < data_arr.length; i++) {
      //   this.parent = data_arr[i];
      //   this.checkIn = false;
      //   // console.log(JSON.parse(JSON.stringify(newData)), data_arr[i]);
      //   do {
      //     this.getParent(this.parent.id);
      //     this.checkId(this.parent.id, newData);
      //     // console.log(this.checkIn, JSON.parse(JSON.stringify(this.parent)));
      //   } while (!this.checkIn);
      //   // console.log(data_arr[i], this.parent);
      //   this.insertItem(data_arr[i], this.parent.id, newData, newData);
      // }
      // console.log(newData);
      this.handleID(newData);
      this.$emit("getCopyArr", newData);
    },
    // 标识复制的数据
    setCopyArr(set_arr) {
      // console.log(this.copy_arr, set_arr);
      if (this.copy_arr.indexOf(set_arr.id) != -1) {
        set_arr.select = true;
      }
      for (let i = 0; i < set_arr.children.length; i++) {
        if (
          set_arr.children[i].children &&
          set_arr.children[i].children.length > 0
        ) {
          this.setCopyArr(set_arr.children[i]);
        } else {
          // console.log(set_arr.children[i].id);
          if (this.copy_arr.indexOf(set_arr.children[i].id) != -1) {
            // console.log(set_arr.children[i]);
            set_arr.children[i].select = true;
          }
        }
      }
    },
    // 处理标识完的数据
    handleCopyArr(set_arr) {
      // console.log(set_arr);
      for (let i = 0; i < set_arr.children.length; i++) {
        if (!set_arr.children[i].select) {
          let arr = set_arr.children[i].children
            ? set_arr.children[i].children
            : [];
          set_arr.children.splice(i, 1, ...arr);
          this.handleCopyArr(set_arr);
        } else {
          // console.log(set_arr.children[i]);
          if (
            set_arr.children[i].children &&
            set_arr.children[i].children.length > 0
          ) {
            this.handleCopyArr(set_arr.children[i]);
          }
        }
      }
    },
    // 处理标识完的数据
    adjustCopy(set_arr) {
      for (let i = 0; i < set_arr.children.length; i++) {
        if (set_arr.children[i].select) {
          delete set_arr.children[i].select;
        }
        // console.log(set_arr.children[i]);
        if (
          set_arr.children[i].children &&
          set_arr.children[i].children.length > 0
        ) {
          this.adjustCopy(set_arr.children[i]);
        }
      }
    },
    // (弃用方法)
    // 获取复制的数组
    getCopyArr(arr, get_arr) {
      for (let i = 0; i < arr.children.length; i++) {
        if (this.copy_arr.indexOf(arr.children[i].id) != -1) {
          let new_arr = JSON.parse(JSON.stringify(arr.children[i]));
          new_arr.children = [];
          get_arr.push(new_arr);
        }
        if (arr.children[i].children && arr.children[i].children.length > 0) {
          this.getCopyArr(arr.children[i], get_arr);
        }
      }
    },
    // 获取父节点
    getParent(id, arr = this.data) {
      for (let i = 0; i < arr.children.length; i++) {
        if (arr.children[i].id == id) {
          this.parent = arr;
        }
        if (arr.children[i].children && arr.children[i].children.length > 0) {
          this.getParent(id, arr.children[i]);
        }
      }
    },
    // 检查节点存在
    checkId(id, arr = this.data) {
      // console.log(id, JSON.parse(JSON.stringify(arr)));
      if (arr.id == id) {
        this.checkIn = true;
      }
      for (let i = 0; i < arr.children.length; i++) {
        if (arr.children[i].children && arr.children[i].children.length > 0) {
          this.checkId(id, arr.children[i]);
        } else {
          if (arr.children[i].id == id) {
            this.checkIn = true;
          }
        }
      }
    },
    // 插入子节点
    insertItem(item, id, default_arr, arr = this.data) {
      // console.log(item.id, id, arr);
      if (arr.id == id) {
        if (!arr.children) {
          arr.children = [];
        }
        this.checkIn = false;
        this.checkId(item.id, default_arr);
        // console.log(JSON.parse(JSON.stringify(default_arr)));
        if (!this.checkIn) {
          arr.children.push(item);
          // console.log(JSON.parse(JSON.stringify(arr)));
        }
      }
      for (let i = 0; i < arr.children.length; i++) {
        // console.log(arr.children[i]);
        if (arr.children[i].children && arr.children[i].children.length > 0) {
          this.insertItem(item, id, default_arr, arr.children[i]);
        }
      }
    },
  },
};
</script>

<style scoped>
.diagram-tree-container {
  position: relative;
  display: inline-block;
  padding: 15px;
}
.diagram-tree {
  display: table;
  text-align: center;
}
.diagram-tree > .diagram-tree-node {
  padding-top: 0;
}
.diagram-tree > .diagram-tree-node:after {
  border-left: 0;
}
.diagram-tree:after,
.diagram-tree:before {
  content: "";
  display: table;
}
.diagram-tree:after {
  clear: both;
}
.add-option {
  z-index: 89;
  position: absolute;
  top: 0;
  left: 0;
  max-width: 254px;
  padding: 2px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 5px #00000026;
}
.add-option > div {
  float: left;
  width: 115px;
  height: 50px;
  margin: 2px;
}
.add-option > div > div {
  width: 111px;
  height: 46px;
  line-height: 46px;
  margin: 2px;
  background-color: #fafafa;
  color: #333;
  font-size: 14px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
}
.add-option > div > div:hover {
  background-color: #fff;
  box-shadow: 0 1px 5px #00000026;
}
.drawer-box {
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media all and (min-width: 577px) {
  .drawer-mask {
    float: left;
    width: 60%;
    height: 100%;
    background-color: #00000034;
    cursor: pointer;
  }
  .drawer {
    float: right;
    width: 40%;
    height: 100%;
    background-color: #fff;
  }
}
@media all and (max-width: 576px) {
  .drawer-mask {
    float: left;
    width: 5%;
    height: 100%;
    background-color: #00000034;
    cursor: pointer;
  }
  .drawer {
    float: right;
    width: 95%;
    height: 100%;
    background-color: #fff;
  }
}
.drawer .title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: #333;
  font-size: 20px;
  font-weight: 700;
  text-align: left;
}
.form {
  margin: 10px 20px;
  text-align: left;
}
</style>
