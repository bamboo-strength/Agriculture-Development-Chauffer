import { formatDate } from '@/utils/date';

const formatType = 'yyyy-mm-dd HH:MM:SS';

const today = new Date();
const yesterday = today.getTime() - 1000 * 60 * 60 * 24 * 3;

const truckingOrderForm = {
  custNo: null, // 客户编号
  organizationId: null, // 所属单位编号
  materialNo: null, // 物资编号
  startDate: formatDate(new Date(yesterday), formatType), // 开始时间
  endDate: formatDate(today, formatType), // 结束时间
  vehicleNo: null, // 车号
  businessType: null, // 业务类型
  vehicleStatus: null // 车辆状态
};

const businessTypes = [
  { value: '01', text: '销售' },
  { value: '02', text: '采购' }
];

const vehicleStatus = [
  { value: '0', text: '已派车' },
  { value: '2', text: '第一次过磅' },
  { value: '4', text: '第二次过磅' },
  { value: '5', text: '出门岗' },
]

export const truckingOrder = {
  truckingOrderForm,
  businessTypes,
  vehicleStatus
}
