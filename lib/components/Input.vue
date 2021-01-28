<template>
  <span>
    <div
      v-if="option.title != ''"
      style="line-height: 50px; font-size: 15px; font-weight: 700"
    >
      {{ option.title }}
    </div>
    <template v-if="option.type == 'input'">
      <input
        type="text"
        :name="option.name"
        :value="option.value"
        @change="changeValue"
      />
    </template>
    <template v-else-if="option.type == 'radio'">
      <div style="line-height: 30px; font-size: 12px">
        <label
          v-for="item in option.option"
          :key="item.key"
          style="display: inline-block; cursor: pointer; margin: 0 10px 0 0"
        >
          <input
            type="radio"
            :name="option.name"
            :checked="item.key == option.value"
            :value="item.key"
            @change="changeValue"
            style="
              float: left;
              display: inline-block;
              margin: 9.3px 3px 0 3px;
              overflow-y: auto;
            "
          />
          <span style="display: inline-block">{{ item.value }}</span>
        </label>
      </div>
      <div
        v-if="
          option.hasOwnProperty('show') &&
          option.show.hasOwnProperty(option.value) &&
          option.show[option.value].length > 0
        "
      >
        <Inputs
          v-for="item in option.show[option.value]"
          :key="item.name"
          :input="item"
          @change="change"
        ></Inputs>
      </div>
    </template>
    <template v-else-if="option.type == 'multiple'">
      <div class="multiple" @click="show = true">
        {{
          option.value
            .map((v) => {
              if (option.option.findIndex((i) => i.key == v) != -1) {
                return option.option[option.option.findIndex((i) => i.key == v)]
                  .value;
              }
            })
            .join("，")
        }}
      </div>
      <div v-if="show" class="multiple-box">
        <div class="multiple-choose">
          <div style="line-height: 40px; font-size: 15px; font-weight: 700">
            {{ option.title }}
          </div>
          <div style="flex: 1">
            <label
              v-for="item in option.option"
              :key="item.key"
              style="display: inline-block; cursor: pointer; margin: 0 10px 0 0"
            >
              <input
                type="checkbox"
                :name="option.name"
                :checked="option.value.indexOf(item.key) != -1"
                :value="item.key"
                @change="changeValue"
                style="
                  float: left;
                  display: inline-block;
                  margin: 5px 3px 0 0;
                  overflow-y: auto;
                "
              />
              <span style="display: inline-block">{{ item.value }}</span>
            </label>
          </div>
          <div class="multiple-save">
            <button @click="show = false">确认</button>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="option.type == 'select'">
      <select @change="changeValue" :value="option.value">
        <option v-for="item in option.option" :key="item.key" :value="item.key">
          {{ item.value }}
        </option>
      </select>
    </template>
    <template v-else-if="option.type == 'time'">
      <span v-for="item in option.input" :key="item.name">
        <Inputs :input="item" @change="change"></Inputs>
      </span>
    </template>
  </span>
</template>

<script>
export default {
  name: "Inputs",
  props: {
    input: {
      type: Object,
      default: () => {
        return {
          type: "input",
          name: "input",
          title: "输入",
          value: "",
          placeholder: "请输入",
        };
      },
    },
  },
  data() {
    return {
      option: this.input,
      show: false,
    };
  },
  components: {},

  methods: {
    changeValue(v) {
      console.log(v);
      if (this.option.type == "radio") {
        this.option.value = v.target.value;
      }
      if (this.option.type == "multiple") {
        if (v.target.checked) {
          this.option.value.push(v.target.value);
        } else {
          this.option.value.splice(
            this.option.value.indexOf(v.target.value),
            1
          );
        }
      }
      if (this.option.type == "select") {
        this.option.value = v.target.value;
      }
      if (this.option.type == "input") {
        this.option.value = v.target.value;
      }
      this.change(this.option);
    },
    change(option) {
      if (this.option.type == "radio" && option.name != this.option.name) {
        this.option.show[this.option.value][
          this.option.show[this.option.value].findIndex(
            (v) => v.name == option.name
          )
        ] = option;
        this.$emit("change", this.option);
      } else if (
        this.option.type == "time" &&
        option.name != this.option.name
      ) {
        this.option.input[
          this.option.input.findIndex((v) => v.name == option.name)
        ] = option;
        this.$emit("change", this.option);
      } else {
        this.$emit("change", option);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.multiple {
  min-height: 30px;
  line-height: 30px;
  padding: 0 20px;
  border: 1px solid #cecece;
  border-radius: 2px;
  cursor: pointer;
}
.multiple:hover {
  border: 1px solid #0077ff;
}
.multiple-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000049;
}
.multiple-choose {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  padding: 20px;
  margin: -150px 0 0 -150px;
  background-color: #fff;
  border-radius: 10px;
}
.multiple-save {
  height: 30px;
  line-height: 30px;
  text-align: right;
}
.multiple-save button {
  min-width: 80px;
  height: 30px;
  margin: 0 10px;
  padding: 0 5px;
  background-color: #0077ff;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.multiple-save button:hover {
  background-color: #4b9fff;
}
input[type="text"] {
  height: 25px;
  margin: 5px;
  padding: 0 10px;
  border: 1px solid #c2c2c2;
  outline: none;
}
select {
  height: 25px;
  margin: 5px;
  border: 1px solid #c2c2c2;
  outline: none;
}
</style>
