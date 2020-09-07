import Vue from 'vue'
import { 
    Input ,
    Icon,
    message,
    List,
    Carousel,
}  from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Input)
Vue.use(Icon)
Vue.use(List)
Vue.use(Carousel)

message.config({
    top: `70px`,
    duration: 2,
    maxCount: 3,
  });
Vue.prototype.$message = message;