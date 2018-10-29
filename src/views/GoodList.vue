<template>
    <div>
      <nav-header></nav-header>
      <div class="nav-breadcrumb-wrap">
        <div class="container">
          <nav class="nav-breadcrumb">
            <a href="/">Home</a>
            <router-link to="/cart">Goods</router-link>
            <router-link to="/address">Address</router-link> 
          </nav>
        </div>
      </div>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setALLPriceFilter()">All</a></dd>
                <dd v-for="(price,index) in priceFilster" :key="index">
                  <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)" >{{price.starPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item) in goodList" :key="item.productId">
                    <div class="pic">
                      <a href="#"><img v-lazy="'../../../static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  <img src="../assets/loading-spinning-bubbles.svg" v-if="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closepop"></div>
      <modal :mdshow="mdshow" @closeModal="closeModal">
        <span slot="message">请先登录，否则无法加入购物车</span>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdshow=false">关闭</a>
        </div>
      </modal>
      <modal :mdshow="mdShowCart" @closeModal="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdShowCart=false ">继续购物</a>
          <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <footer class="footer">
        <div class="footer__wrap">
          <div class="footer__secondary">
            <div class="footer__inner">
              <div class="footer__region">
                <span>Region</span>
                <select class="footer__region__select">
                  <option value="en-US">USA</option>
                  <option value="zh-CN">China</option>
                  <option value="in">India</option>
                </select>
              </div>
              <div class="footer__secondary__nav">
                <span>Copyright © 2017 IMooc All Rights Reserved.</span>
                <a href="http://us.lemall.com/us/aboutUs.html">
                  About Us
                </a>
                <a href="http://us.lemall.com/us/termsofUse.html">
                  Terms &amp; Conditions
                </a>
                <a href="http://us.lemall.com/us/privacyPolicy.html">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
</template>

<script>
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import '../assets/css/login.css'
  import axios from 'axios'
  import NavHeader from '../components/NavHeader.vue'
  import Modal from '../components/Modal.vue'
    export default {
        data() {
            return {
              goodList:[],
              priceFilster:[
                {
                  starPrice:'0.00',
                  endPrice:'100.00'
                },
                {
                  starPrice:'100.00',
                  endPrice:'500.00'
                },
                {
                  starPrice:'500.00',
                  endPrice:'1000.00'
                },
                {
                  starPrice:'1000.00',
                  endPrice:'5000.00'
                }
              ],
              priceChecked:'all',
              filterBy:false,
              overLayFlag:false,
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:true,
              loading:false,
              mdshow:false,
              mdShowCart:false
            }

        },
      methods:{
          getGoods(flag){
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceChecked:this.priceChecked
            }
            this.loading=true
            axios.get('/goods/list',{
              params:param
            }).then(res =>{
              res =res.data
              if(flag){
                this.goodList = this.goodList.concat(res.result.list)
                if(res.result.count ===0){
                  this.busy=true
                }else {
                  this.busy=false

                }
              }else {
                this.goodList = res.result.list
                this.busy=false
              }
              this.loading=false
            } )

          },
        showFilter(){
          this.filterBy=true
          this.overLayFlag=true

        },
        closepop(){
          this.filterBy=false
          this.overLayFlag=false
        },
        sortGoods(){
          this.sortFlag=!this.sortFlag
          this.page=1;
          this.getGoods()

        },
        loadMore(){
          this.page++
          this.busy=true
          setTimeout(() => {
              this.getGoods(true)
          }, 500);
        },
        setPriceFilter(index){
          this.priceChecked=index
          this.page = 1
          this.getGoods(false)
        },
        setALLPriceFilter(){
          this.priceChecked='all'
          this.getGoods(false)
        },
        addCart(productId){
          axios.post("/goods/addCart",{productId}).then((res)=>{
            if(res.data.status===0){
              this.mdShowCart=true
            }else {
              this.mdshow=true
            }

          })
        },
        closeModal(){
          this.mdshow=false
          this.mdShowCart=false
        }
      },
      mounted(){
          this.getGoods(false)
      },
      components:{
        NavHeader,
        Modal

      }
    }
</script>

<style>
</style>
