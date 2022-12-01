<template>
  <view>
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" right-icon="search" title="派车单查询" @clickLeft="goBack" @clickRight="open" />
    </view>

    <uni-card
      v-for="(item, index) in truckingOrderData"
      spacing="0"
      :key="index"
      is-shadow>
      <template v-slot:title>
        <view class="uni-card__header">
          <view class="uni-card__header-box">
            <view class="uni-card__header-content">
              <view class="uni-card__header-content-title uni-ellipsis">
                <text style="font-size: 18px;">
                  <text class="iconfont icon-order" style="color: #4581f5; padding: 0 4px;" />
                  派车单查询: {{item.dispatchNo}}
                </text>
              </view>
            </view>
          </view>
        </view>
      </template>
      
      <view>111</view>
    </uni-card>
    <uni-popup ref="popup" background-color="#fff">
      <view class="popup-content">
        <uni-forms ref="searchForm" :modelValue="searchForm" label-align="right" label-width="100">
          <uni-forms-item label="客户信息:">
            <uni-combox v-model="searchForm.custNo" :candidates="custData" combox="custNo" title="custName" remote placeholder="请输入客户简码进行检索" @input="searchCust"></uni-combox>
          </uni-forms-item>
          <uni-forms-item label="物资信息:">
            <uni-combox v-model="searchForm.materialNo" :candidates="materialData" combox="materialCode" title="materialName" remote placeholder="请输入物资简码进行检索" @input="searchMaterial"></uni-combox>
          </uni-forms-item>
          <uni-forms-item label="所属单位">
            <uni-data-picker
              v-model="searchForm.organizationId"
              :localdata="unitData"
              :map="defaultProps"
              placeholder="请选择所属单位"
              popup-title="请选择所属单位"
            />
          </uni-forms-item>
          <uni-forms-item label="业务类型:">
            <uni-data-select v-model="searchForm.businessType" :localdata="businessTypes" clear placeholder="请选择业务类型" />
          </uni-forms-item>
          <uni-forms-item label="车辆状态:">
            <uni-data-select v-model="searchForm.vehicleStatus" :localdata="vehicleStatus" clear placeholder="请选择车辆状态" />
          </uni-forms-item>
          <uni-forms-item label="开始时间:">
            <uni-datetime-picker v-model="searchForm.startDate" type="datetime" />
          </uni-forms-item>
          <uni-forms-item label="结束时间:">
            <uni-datetime-picker v-model="searchForm.endDate" type="datetime" />
          </uni-forms-item>

          <view style="text-align: right;">
            <button type="primary" class="ui-button" style="margin-right: 8px;" @click="search">查 询</button>
            <button type="default" class="ui-button" style="margin-left: 8px;" @click="reset">重 置</button>
          </view>
        </uni-forms>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import _, { result } from 'lodash';
  import { truckingOrder } from './index';
  import { commonApi } from '@/api/common';
  import { truckingOrderApi } from '@/api/truckingOrder';

  export default {
    data() {
      return {
        searchForm: _.cloneDeep(truckingOrder.truckingOrderForm),
        custData: [],
        materialData: [],
        unitData: [],
        businessTypes: truckingOrder.businessTypes,
        vehicleStatus: truckingOrder.vehicleStatus,
        defaultProps: {
          value: 'code',
          text: 'name'
        },
        selectCache: {},
        pageNum: 1,
        pageSize: 5,
        truckingOrderData: [],
        completed: false
      }
    },
    created() {
      this.getUnit();
      this.getPager();
    },
    methods: {
      goBack() {
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },

      getUnit() {
        commonApi.getUnit()
          .then(result => {
            this.unitData = [
              ...result.list
            ]
          })
      },

      open() {
        this.$refs.popup.open('bottom');
      },

      // 客户信息检索
      searchCust($event) {
        commonApi.getCust({ spellCode: $event })
          .then(result => {
            if (!result.success) {
              this.custData = [];
              return;
            }
            this.custData = [
              ...result.list
            ]
          })
      },

      // 物资检索
      searchMaterial($event) {
        commonApi.getMaterial({ spellCode: $event })
          .then(result => {
            if (!result.success) {
              this.materialData = [];
              return;
            }
            this.materialData = [
              ...result.list
            ]
          })
      },

      search() {
        this.pageNum = 1;
        Object.assign(this.selectCache, this.searchForm);
        this.getPager();
      },

      reset() {
        this.pageNum = 1;
        this.searchForm = _.cloneDeep(truckingOrder.truckingOrderForm);
        this.selectCache = {};
        this.getPager();
      },

      getPager() {
        const vehicleNo = uni.getStorageSync('vehicleNo');
        const params = {
          ...this.selectCache,
          // vehicleNo,
          pageNo: this.pageNum,
          pageSize: this.pageSize
        };

        truckingOrderApi.getDispatch(params)
          .then(result => {
            this.truckingOrderData = result.list;
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box-bg {
    z-index: 999;
  }
  .uni-popup.top {
    top: calc(var(--status-bar-height) + 45px);
  }

  .popup-content {
    padding: 16px 8px;
  }

  .ui-button {
    display: inline-block;
    width: calc(50% - 8px);
    font-size: 14px;
  }
</style>
<style lang="scss" src="@/uni_modules/uni-card/components/uni-card/uni-card.scss"></style>
