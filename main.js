import Vue from 'vue'
import App from './App'
import * as Api from './config/api.js'

import * as Common from './config/common.js'
import * as Db from './config/db.js'
import * as Config from './config/config.js'

import store from './store'
import './common/uni-H5Api'

Vue.config.productionTip = false
Vue.prototype.$api = Api;
Vue.prototype.$common = Common;
Vue.prototype.$db = Db;
Vue.prototype.$config = Config;
Vue.prototype.$store = store;

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()


// Array.prototype.indexOf = function(val) { 
//     for (var i = 0; i < this.length; i++) { 
//         if (this[i] == val) return i; 
//     } 
//     return -1; 
// };  
// Array.prototype.remove = function(val) { 
//     var index = this.indexOf(val); 
//         if (index > -1) { 
//             this.splice(index, 1); 
//         } 
// };