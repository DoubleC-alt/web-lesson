/*
全局变量控制
优点：一旦在state这个属性里声明，那么这个属性就能在整个项目里任何地方(*.vue)使用
注意：一旦页面刷新、关闭浏览器，甚至关机 ，那么在state里声明属性的值就清空了
*/
import Vue from 'vue';
import Vuex from 'vuex';
import {Http,ImgUrl} from '@/kits/Http';
import {getCacheVal} from '@/kits/LocalStorage'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        cartData: [],
        searchInput:"",
        goodCategory:"",
        selectedGood:{
            id:"",
            type:"",
        },
        selectedGoods:[],
        selectedOrder:{}
    },
    //同步修改
    mutations:{
        initCart(state,data){
            state.cartData = data
        },
        pushCart(state,item){
            let index = -1
            for(let i = 0; i < state.cartData.length ;i++){
                if(state.cartData[i].id === item.id){
                    index = i
                    break
                }
            }
            if(index > -1){
                //this.commit("increaseCart",index)  也可以
                store.commit("increaseCart",index)
            }else{
                state.cartData.push(item)
            }
            
        },
        increaseCart(state,index){  
            if(state.cartData[index].countbuy < 99){
                state.cartData[index].countbuy += 1
            }
        },
        decreaseCart(state,index){
            if(state.cartData[index].countbuy > 0){
                state.cartData[index].countbuy -= 1
            }
        },
        setSearchInput(state,newVal){
            state.searchInput = newVal
        },
        setGoodCategory(state,newVal){
            state.goodCategory = newVal
        },
        setSelectedGood(state,item){
            state.selectedGood = item
        },
        addSelectedGoods(state,item){
            state.selectedGoods.push(item)
        },
        popSelectedGoods(state){
            state.selectedGoods.pop()
        },
        removeCart(state,index){
            if(state.cartData[index].countbuy === 0){
                state.cartData.splice(index,1)
            }
        },
        resetCart(state){
            state.cartData = []
        },
        setSelectedOrder(state,item){
            state.selectedOrder = item
        }
    },
    //异步修改
    actions:{
        pushCart(context,item){
            item.imgpath = ImgUrl + item.imgpath
            context.commit("pushCart",item)
            let cartitem = context.state.cartData.filter((t)=>(t.id === item.id))
            doCart(item.id,cartitem.length >0 ? cartitem[0].countbuy : 0)
        },
        increaseCart(context,index){
            context.commit("increaseCart",index)
            let cartitem = context.state.cartData[index]
            doCart(cartitem.id,cartitem.countbuy)
        },
        decreaseCart(context,index){
            context.commit("decreaseCart",index)
            let cartitem = context.state.cartData[index]
            doCart(cartitem.id,cartitem.countbuy)
            context.commit("removeCart",index)
        },
        async order(context){
            const p = {
                userid:getCacheVal("userid"),
                orderlist:context.state.cartData
            }
            try {
                let res = await Http("/createorder",p)
                if (res.code === 1) {
                    await Http("/resetcart",{
                        userid:getCacheVal("userid")
                    })
                    context.commit('resetCart')
                    return res
                }
            } catch (e) {
                return e
            }
        }
    },
    getters:{
        cartTotalPrice:(state)=>{
            let total = 0
            return "¥ " + state.cartData.reduce((acc,item)=>(acc+item.price*item.countbuy),total)
        }
    }
})

const doCart = (goodid,num) => {
    Http("/goodaddcart",{
        userid:getCacheVal("userid"),
        goodid,
        num,
    })
}

export default store