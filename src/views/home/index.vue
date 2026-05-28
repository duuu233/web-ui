<template>
  <div class="app-container">
    <div class="daily-box">
      <div class="title-box">关键指标</div>
      <div class="daily-data">
        <div class="daily-item">
          <div class="daily-item-tp">
            <span class="daily-item-num">{{ statisticsData.userCount }}</span>
          </div>
          <div class="daily-item-bt">用户数量</div>
        </div>
        <div class="daily-item">
          <div class="daily-item-tp">
            <span class="daily-item-num">{{
              statisticsData.productCount
            }}</span>
          </div>
          <div class="daily-item-bt">产品数量</div>
        </div>
        <div class="daily-item">
          <div class="daily-item-tp">
            <span class="daily-item-num">{{
              statisticsData.productFaqCount
            }}</span>
          </div>
          <div class="daily-item-bt">常见问题总量</div>
        </div>
      </div>
    </div>

    <div class="static-category-box">
      <div class="handle-box">
        <category-static></category-static>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCount } from '@/api/home'
import OrderStatic from './OrderStatic.vue'
import SaleStatic from './SaleStatic.vue'
import CategoryStatic from './CategoryStatic.vue'
import img_home_order from '@/assets/images/home_order.png'
import img_home_publish from '@/assets/images/home_publish.png'
import img_home_user from '@/assets/images/home_user.png'
export default {
  name: 'home',
  components: {
    'order-static': OrderStatic,
    'sale-static': SaleStatic,
    'category-static': CategoryStatic
  },
  data() {
    return {
      img_home_order,
      img_home_publish,
      img_home_user,
      statisticsData: {},
      wayBillRatioObj: {},
      isCreated: false
    }
  },
  activated() {
    if (this.isCreated) {
      this.getStatisticsData()
    }
    this.isCreated = false
  },
  deactivated() {
    this.isCreated = true
  },
  created() {
    this.isCreated = true
    this.getStatisticsData()
  },
  methods: {
    getStatisticsData() {
      getUserCount().then(res => {
        if (res.retCode === 200) {
          this.statisticsData = res.retData
        } else {
          this.$message({
            type: 'success',
            message: '获取统计数据失败'
          })
        }
      })
    },
    getStatisticsToTmsWayBillRatio() {
      getStatisticsToTmsWayBillRatio().then(res => {
        if (res.retCode === 200) {
          this.wayBillRatioObj = res.retData
        } else {
          this.$message({
            type: 'success',
            message: '获取运单统计比例失败'
          })
        }
      })
    },
    goto(path, query) {
      this.$router.push({
        path: path,
        query: query ? query : ''
      })
    }
  }
}
</script>

<style scoped lang="scss">
.daily-box {
  background: #fff;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;

  height: 200px;
}
.daily-data {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  // box-shadow: 0px 4px 81px 0px rgba(241, 242, 247, 0.82);
}
.daily-item {
  padding: 0 30px 30px 30px;
  flex-grow: 1;
}
.daily-item-num {
  font-size: 35px;
  line-height: 50px;
  color: #333;
  font-weight: bold;
}
.daily-item-per {
  font-size: 12px;
  color: #999999;
  font-weight: 500;
}
.daily-item-tp {
  font-weight: 12px;
  color: #6d7a8e;
  font-weight: 400;
  margin-bottom: 10px;
}
.daily-item-bt {
  font-weight: 12px;
  color: #6d7a8e;
  font-weight: 400;
  margin-bottom: 30px;
}
.title-box {
  width: 100%;
  font-size: 18px;
  color: #2274e7;
  font-weight: 400;
  line-height: 28px;
  position: relative;
  padding-left: 40px;
  background: #fff;
  padding: 30px 0 30px 40px;
}
.title-box::before {
  display: block;
  content: '';
  width: 4px;
  height: 20px;
  background: #2274e7;
  position: absolute;
  border-radius: 2px;
  left: 0;
  top: 34px;
}
.layout-info {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.layout-info-lf {
  flex-grow: 2;
  margin-right: 30px;
}
.layout-info-lf .title-box {
  margin-top: 30px;
}
.layout-info-rt {
  /* flex-grow: 1; */
  width: 500px;
}
.handle-box-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px 20px;
}
.handle-box-list > div:nth-child(2n + 1) {
  margin-right: 20px;
}
.home-handle-item {
  flex-grow: 2;
  border-radius: 20px;
  background: #f3f6fd;
  text-align: center;
  padding: 20px 0;
}
.home-handle-item .num {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  padding-bottom: 15px;
}
.home-handle-item .txt {
  font-size: 14px;
  font-weight: 400;
  color: #6d7a8e;
}
.home-handle-warning {
  background: #fff0f0;
}
.handle-box-list .home-handle-warning p {
  color: #f34d4d;
}
.quick-handle-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  color: #6d7a8e;
  font-size: 14px;
  font-weight: 400;
  padding: 0 60px 40px;
  text-align: center;
}
.quick-handle-item {
  width: 55px;
}
.quick-handle-item img {
  width: 55px;
  height: 55px;
}
.quick-handle-item p {
  margin-top: 20px;
}
.arrow-down {
  color: #f34d4d;
}
.arrow-up {
  color: #00e110;
}
.pointer {
  cursor: pointer;
}
.static-category-box {
  background: #fff;
  border-radius: 10px;
}
</style>
