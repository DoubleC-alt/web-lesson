<template>
    <div>
        <top-bar @searchInputChangeHandle="searchInputChange" :searchInput="searchInput">
            <div @click="back" slot="left" class="iconfont icon-back1" style="font-size:24px" ></div>
            <div @click="search" slot="right" class="iconfont icon-search" style="font-size:24px" ></div>
        </top-bar> 
        <my-content :refreshFunc="refresh" pull>
            <div style="color:rgb(0 0 0 / 0.5);font-size:15px;font-weight: bold;">有{{data.length}}个商品符合要求</div>
            <div 
                style="margin-top:16px;"
                v-infinite-scroll="handleInfiniteOnLoad" 
                :infinite-scroll-disabled="busy"
                :infinite-scroll-distance="10"
            >
                <a-list :grid="{ gutter: 16, column: 2 }" :data-source="data">
                    <a-list-item slot="renderItem" slot-scope="item">
                        <product-card :product="item"></product-card>
                    </a-list-item>
                </a-list>
            </div>
        </my-content>
    </div>
</template>

<script>
import TopBar from '@/components/topbar/TopBar'
import MyContent from '@/components/content/MyContent'
import ProductCard from '@/components/product/ProductCard'
import {setArray,getArray} from '@/kits/LocalStorage'
import {HttpGql,ImgUrl} from '@/kits/Http'
import infiniteScroll from 'vue-infinite-scroll';

export default {
    directives: { infiniteScroll },
    name:"Search",
    data(){
        return {
            start:0,
            data:[],
            // searchInput:this.$route.params.content,   //Vue
            busy: false,
            searchInput:"",   //Vue
            historySearch:getArray("historySearch"),  //本项目的获取localstorage时，是线性获取，或者说不是异步获取
         }
    },
    components:{
        TopBar,
        MyContent,
        ProductCard
    },
    created(){
        //拿到上一个页面的参数
        //进行搜索
        // this.searchInput = this.$route.params.content
        this.searchInput = this.$store.state.searchInput
        // this.search()
    },
    methods:{
        back(){
            this.$router.go(-1)
        },
        refresh(){
            this.start = 0
            this.data = []
            return this.search()
        },
        //async 异步
        //sync  同步
        async search(){
            // this.data = this.data.filter((item)=>(item.name.indexOf(this.searchInput) > -1))
            let pageCount = 8
            let p = {
                query:`
                    {
                        goods(start:${this.start},count:${pageCount},name:"${this.searchInput}",desc:"${this.searchInput}"){
                            id
                            name
                            price
                            count
                            gooddesc
                            imgpath
                            type {
                                id
                            }
                        }
                    }
                `
            }
            try {
                let res = await HttpGql(p)
                this.data = this.data.concat(res.data.goods.map((item)=>{
                    item.imgpath = ImgUrl + item.imgpath
                    return item
                }))
                this.start += pageCount
                return true
            } catch (e) {
                return false
            }
        },
        searchInputChange(content){
            this.start = 0
            this.data = []
            this.searchInput = content
        },
        handleInfiniteOnLoad(){
           this.search()
        }
    }
}
</script>

<style scoped>

.history-search-content {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 14px;
}

.history-search-item {
    background-color: #fff;
    padding: 2px 6px 2px 6px;
    border-radius: 5px;
    box-shadow: 0px 1px 2px rgb(40 40 40 / 0.2);
    margin-top: 8px;
    margin-right: 5px;
}

</style>