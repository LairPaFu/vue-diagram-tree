import DiagramTree from './lib/Index'

DiagramTree.install = function (Vue) {
    Vue.component(DiagramTree.name, DiagramTree)
    // Vue.component(UScrollPage.name, UScrollPage) 注册多个插件
}
// 支持使用标签的方式引入Vue  是全局变量global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default DiagramTree