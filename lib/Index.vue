
<template>
  <div class="diagram-tree-container">
    <div class="diagram-tree">
      <div class="diagram-tree-node">
        <Node
          :tree="datas"
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
    <div
      v-show="optionShow"
      class="add-option"
      :style="{ height: 60 * (Math.ceil(options / 2) + 1) + 10 + 'px' }"
    >
      <div v-for="(item, index) in options" :key="index">
        <div @click="addProcessEvent(item.name)">{{ item.title }}</div>
      </div>
      <div>
        <div @click="addFactor">条件分支</div>
      </div>
    </div>
    <div v-if="selectTree != null && drawer" class="drawer-box">
      <div class="drawer-mask" @click="drawerClose"></div>
      <div class="drawer">
        <div class="title">
          <template v-if="selectTree.type == 'task-node'">
            <div>{{ selectTree.title }}</div>
            <div style="font-size: 14px">
              <select
                v-if="setNode"
                :value="selectTree.index"
                @change="changeSelect"
              >
                <option
                  v-for="(item, index) in setNode.children"
                  :key="index + 1"
                  :value="index + 1"
                >
                  优先级 {{ index + 1 }}
                </option>
              </select>
            </div>
          </template>
          <div v-else>
            {{
              others.filter((v) => {
                return v.name == selectTree.type;
              }).length > 0
                ? others.filter((v) => {
                    return v.name == selectTree.type;
                  })[0].title
                : options.filter((v) => {
                    return v.name == selectTree.type;
                  }).length > 0
                ? options.filter((v) => {
                    return v.name == selectTree.type;
                  })[0].title
                : ""
            }}
          </div>
        </div>
        <template v-if="Ddrawer">
          <div v-for="item in selectTree.setting" :key="item.name" class="form">
            <Inputs :input="item" @change="change"></Inputs>
          </div>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Node from "./Node";
import Inputs from "./components/Input";
export default {
  name: "diagram-tree",
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          id: "1",
          type: "sponsor",
          sponsor: ["pafu"],
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
        return [
          {
            name: "sponsor",
            title: "发起人",
            color: "#3c3fff",
            default: {
              type: "sponsor",
              sponsor: [],
              setting: [],
            },
          },
        ];
      },
    },
    factor: {
      type: Array,
      default: () => {
        return [];
      },
    },
    Ddrawer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      datas: this.data,
      index: [],
      checkArray: [],
      selectTree: null,
      optionShow: false,
      drawer: false,
      save: [],
      setNode: {},
    };
  },
  components: { Node, Inputs },
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
    // 子节点下id递增
    idAdd(arr, id) {
      arr.map((v) => {
        v.id = id + "1" + v.id.substring(id.length);
        if (v.hasOwnProperty("children") && v.children.length > 0) {
          this.idAdd(v.children, id);
        }
      });
    },
    // 获得选择node位置数组
    getArray(id) {
      this.checkArray = [];
      this.index = [];
      this.findIndex(this.datas.children, id);
      let index = this.checkArray;
      this.checkArray = [];
      this.index = [];
      return index;
    },
    // 点击编辑
    clickNode(tree) {
      this.selectTree = tree;
      if (this.selectTree.type == "task-node") {
        let index = this.getArray(this.selectTree.id);
        let data = JSON.parse(JSON.stringify(this.datas));
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
        this.setNode = res;
      }
      console.log(this.selectTree);
      this.drawer = true;
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
      if (this.optionShow) {
        this.optionShow = false;
        this.selectTree = null;
      }
      this.selectTree = tree;
      this.optionShow = true;
      option.style.left = left + 25 + "px";
      option.style.top = top + "px";
    },
    // 添加流程事件
    addProcessEvent(event) {
      if (this.selectTree != null) {
        if (this.selectTree.id == 1) {
          let data = JSON.parse(JSON.stringify(this.datas));
          this.idAdd(data.children, this.selectTree.id);
          let save = JSON.parse(JSON.stringify(data.children));
          data.children = [];
          let set = JSON.parse(JSON.stringify(this.options)).filter((v) => {
            return v.name == event;
          })[0].default;
          set.id = this.selectTree.id + "1";
          set.children = save;
          data.children.push(set);
          this.changeNode(data);
        } else {
          let index = this.getArray(this.selectTree.id);
          let data = JSON.parse(JSON.stringify(this.datas));
          let res = data.children;
          for (let i = 0; i < index.length; i++) {
            if (i >= index.length - 1) {
              res = res[index[i]];
            } else {
              res = res[index[i]].children;
            }
          }
          let set = JSON.parse(JSON.stringify(this.options)).filter((v) => {
            return v.name == event;
          })[0].default;
          set.id = this.selectTree.id + "1";
          if (res.hasOwnProperty("children") && res.children.length > 0) {
            this.idAdd(res.children, this.selectTree.id);
            let save = JSON.parse(JSON.stringify(res.children));
            set.children = save;
          }
          res.children = [];
          res.children.push(set);
          this.changeNode(data);
        }
      }
    },
    // 添加条件分支
    addFactor() {
      if (this.selectTree != null) {
        if (this.selectTree.id == 1) {
          let data = JSON.parse(JSON.stringify(this.datas));
          this.idAdd(data.children, this.selectTree.id);
          let save = JSON.parse(JSON.stringify(data.children));
          data.children = [];
          data.children.push({
            id: this.selectTree.id + "1",
            type: "task-node",
            title: "条件" + 1,
            index: 1,
            factor: [],
            setting: this.factor,
            children: save,
          });
          data.children.push({
            id: this.selectTree.id + "2",
            type: "task-node",
            title: "条件" + 2,
            index: 2,
            factor: [],
            setting: this.factor,
          });
          this.changeNode(data);
        } else {
          let index = this.getArray(this.selectTree.id);
          let data = JSON.parse(JSON.stringify(this.datas));
          let res = data.children;
          for (let i = 0; i < index.length; i++) {
            if (i >= index.length - 1) {
              res = res[index[i]];
            } else {
              res = res[index[i]].children;
            }
          }
          if (res.hasOwnProperty("children") && res.children.length > 0) {
            this.idAdd(res.children, this.selectTree.id);
            let save = JSON.parse(JSON.stringify(res.children));
            res.children = [];
            res.children.push({
              id: this.selectTree.id + "1",
              type: "task-node",
              title: "条件" + 1,
              index: 1,
              factor: [],
              setting: this.factor,
              children: save,
            });
          } else {
            res.children = [];
            res.children.push({
              id: this.selectTree.id + "1",
              type: "task-node",
              title: "条件" + 1,
              index: 1,
              factor: [],
              setting: this.factor,
            });
          }
          res.children.push({
            id: this.selectTree.id + "2",
            type: "task-node",
            title: "条件" + 2,
            index: 2,
            factor: [],
            setting: this.factor,
          });
          this.changeNode(data);
        }
      }
    },
    // 添加条件
    addNode(tree) {
      if (tree.id == 1) {
        let data = JSON.parse(JSON.stringify(this.datas));
        data.children.push({
          id: data.id + (data.children.length + 1),
          type: "task-node",
          title: "条件" + (data.children.length + 1),
          index: data.children.length + 1,
          factor: [],
          setting: this.factor,
        });
        this.changeNode(data);
      } else {
        let index = this.getArray(tree.id);
        let data = JSON.parse(JSON.stringify(this.datas));
        let res = data.children;
        for (let i = 0; i < index.length; i++) {
          if (i >= index.length - 1) {
            res = res[index[i]];
          } else {
            res = res[index[i]].children;
          }
        }
        res.children.push({
          id: res.id + (res.children.length + 1),
          type: "task-node",
          title: "条件" + (res.children.length + 1),
          index: res.children.length + 1,
          factor: [],
          setting: this.factor,
        });
        this.changeNode(data);
      }
    },
    // 数据改变
    changeNode(data) {
      this.datas = data;
      this.$emit("changeNode", data);
    },
    // 配置改变结果保存
    saveCheck(setting) {
      for (let i = 0; i < setting.length; i++) {
        if (setting[i].type == "input") {
          this.save.push(setting[i].value);
        } else if (setting[i].type == "radio") {
          let value = [];
          setting[i].option.map((v) => {
            if (v.key == setting[i].value) {
              value.push(v);
            }
          });
          if (setting[i].hasOwnProperty("show")) {
            this.saveCheck(setting[i].show[value[0].key]);
          }
          if (value[0].show) {
            this.save.push(value[0].value);
          }
        } else if (setting[i].type == "multiple") {
          setting[i].value.map((v) => {
            this.save.push(
              setting[i].option[setting[i].option.findIndex((j) => j.key == v)]
                .value
            );
          });
        } else if (setting[i].type == "select") {
          let value = [];
          setting[i].option.map((v) => {
            if (v.key == setting[i].value) {
              value.push(v);
            }
          });
          this.save.push(value[0].value);
        } else if (setting[i].type == "time") {
          this.save.push(setting[i].title);
          this.saveCheck(setting[i].input);
        }
      }
    },
    // 配置改变
    change(option) {
      this.selectTree.setting[
        this.selectTree.setting.findIndex((v) => v.name == option.name)
      ] = option;
      let save = JSON.parse(JSON.stringify(this.selectTree));
      this.saveCheck(save.setting);
      if (this.selectTree.type == "task-node") {
        this.selectTree.factor = JSON.parse(JSON.stringify(this.save));
      } else {
        this.selectTree[this.selectTree.type] = JSON.parse(
          JSON.stringify(this.save)
        );
      }
      this.save = [];
      console.log(this.selectTree);
      if (this.selectTree.id == "1") {
        let data = JSON.parse(JSON.stringify(this.selectTree));
        this.changeNode(data);
      } else {
        let index = this.getArray(this.selectTree.id);
        let data = JSON.parse(JSON.stringify(this.datas));
        let res = data.children;
        for (let i = 0; i < index.length; i++) {
          if (i >= index.length - 1) {
            res[index[i]] = JSON.parse(JSON.stringify(this.selectTree));
          } else {
            res = res[index[i]].children;
          }
        }
        this.changeNode(data);
      }
    },
    // 选择优先级
    changeSelect(e) {
      if (this.setNode.id == "1") {
        let data = JSON.parse(JSON.stringify(this.datas));
        data.children[e.target.value - 1].index = this.selectTree.index;
        data.children[this.selectTree.index - 1].index = parseInt(
          e.target.value
        );
        let now = JSON.parse(
          JSON.stringify(data.children[this.selectTree.index - 1])
        );
        data.children[this.selectTree.index - 1] = JSON.parse(
          JSON.stringify(data.children[e.target.value - 1])
        );
        data.children[e.target.value - 1] = now;
        this.selectTree.index = e.target.value;
        this.setNode = data;
        this.changeNode(data);
      } else {
        let index = this.getArray(this.setNode.id);
        let data = JSON.parse(JSON.stringify(this.datas));
        let res = data.children;
        for (let i = 0; i < index.length; i++) {
          if (i >= index.length - 1) {
            res = res[index[i]];
          } else {
            res = res[index[i]].children;
          }
        }
        res.children[e.target.value - 1].index = this.selectTree.index;
        res.children[this.selectTree.index - 1].index = parseInt(
          e.target.value
        );
        let now = JSON.parse(
          JSON.stringify(res.children[this.selectTree.index - 1])
        );
        res.children[this.selectTree.index - 1] = JSON.parse(
          JSON.stringify(res.children[e.target.value - 1])
        );
        res.children[e.target.value - 1] = now;
        this.selectTree.index = e.target.value;
        this.setNode = res;
        this.changeNode(data);
      }
    },
    // 删除节点
    deleteNode(tree) {
      let index = this.getArray(tree.id);
      let data = JSON.parse(JSON.stringify(this.datas));
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
    // 关闭遮罩
    drawerClose(){
      this.drawer = false
      this.$emit('drawerClose')
    }
  },
};
</script>

<style scoped>
.diagram-tree-container {
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
  width: 260px;
  height: 130px;
  padding: 5px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 5px #00000026;
}
.add-option > div {
  float: left;
  width: 115px;
  height: 50px;
  margin: 5px;
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
