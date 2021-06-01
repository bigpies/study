const subMenu1 = [
  {
    key: 'warehouseManage',
    route:{ 
      path: 'onOmsSystem/requirementOrderManage',
      before: 'requirementOrderCreate',
      index: 10,
    },
    children: [{
      key: 'inventoryManage',
    },{
      key: 'tempWarehouseManage',
    }],
    
  },
  {
    key: 'smartSupplyChain',
    route:{ 
      after: 'settleAccountsManage',
      index: 2,
    },
    children: [
      {
        key: 'rosManage',
        children: [
          { key: 'taskDetailManage'},
          { key: 'lineDetail'},
        ],
      },
      { key: 'supplierRegister'},
      { key: 'vendorPriceForSpeed'},
      { key: 'vendorParameterManage'},
    ],
  },
  {
    key: 'channelManage',
    route:{ 
      after: 'settleAccountsManage',
      index: 3,
    },
    children: [
      {
        key: 'cpIntentionManage',
      },
    ],
  },
  {
    key: 'dataBoard',
    route:{ 
      after: 'settleAccountsManage',
      index: 40,
    },
    children: [
      { key: 'settlementReport'},
      { key: 'dataReportForm'},
    ],
  },
  {
    key: 'system',
    route:{ 
      after: 'settleAccountsManage',
      index: 5,
    },
    icon: 'setting',
    children: [
      { key: 'releaseManage'},
      { key: 'userManage'},
      { key: 'authGroupManage'},
      { key: 'authManage'},
    ],
  },
];
const menu = [
  {
    key: 'homePage',
    icon: 'home',
  },
  {
    key: 'centerConsole',
    icon: 'warning',
    children: [
      { key: 'workOrderManage',
        visibilityChild: 'hidden',
        children: [
          { key: 'workOrderEditReal' },
          { key: 'workOrderEdit' },
          { key: 'workOrderView' },
          { key: 'workOrderCreate' },
        ],
      },
      { 
        key: 'alarmStatistics',
      },
      { key: 'transportMonitor',
      },
      { key: 'alarmRecord',
      },
      { key: 'alarmSetting',
      },
      {
        key: 'noticeCenter',
      },
      {
        key: 'dataExport',
      },
      {
        key: 'vehicleMonitor',
        routeType: 'micro',
      },
      {
        key: 'NoticeNodeDeploy',
      }
    ],
  },
  {
    key: 'onOmsSystem',
    icon: 'reconciliation',
    children: [{
      key: 'requirementOrderManage',
      visibilityChild: 'hidden',
      children: [
        {
          key: 'requirementOrderCreate',
        },{
          key: 'requirementOrderDetail',
        }
      ]
    },
    {
      key: 'orderManage',
      visibilityChild: 'hidden',
      children: [
        {
          key: 'orderDetail',
          visibilityChild: 'hidden',
          children: [
            {
              key: 'customerServiceInput',
            }
          ],
        },
        { key: 'orderOutBoundPodPrint' },
        { key: 'resendAudit' },
        { key: 'orderCreate' },
        { key: 'orderTrack' },
        { key: 'podManage' },
        { key: 'attachmentManage' },
        { key: 'splitRuleManual' },
    ],
    }, {
      key: 'receiptManage',
    }],
  },
  {
    key: 'onTmsSystem',
    icon: 'deployment-unit',
    children: [
      {
        key: 'splitManage',
        visibilityChild: 'hidden',
        children: [
          { key: 'manualArrangeLine' },
          { key: 'batchManualLine' },
        ],
      },
      {
        key: 'lineManage',
        visibilityChild: 'hidden',
        children: [
          {
            key: 'lineDetail',
            visibilityChild: 'hidden',
            children: [
              { key: 'waybillVisualMap' },
              { key: 'boxInfoEditLine' },
            ],
          },
          {
            key: 'truckSplit',
            visibilityChild: 'hidden',
          },
          {
            key: 'lineEdit',
            visibilityChild: 'hidden',
          },
          {
            key: 'lineWaybillEnclosure',
          },
        ],
      },
      {
        key: 'waybillManage',
        visibilityChild: 'hidden',
        children: [
          {
            key: 'waybillDetail',
            visibilityChild: 'hidden',
            children: [
              { key: 'waybillVisualMap' },
              { key: 'boxInfoEdit' },
            ],
          },
          { key: 'waybillPrint' },
          {
            key: 'lineWaybillEnclosure',
          },
        ],
      },
      {
        key: 'receiveSendManage',
        visibilityChild: 'hidden',
        children: [],
      },
    ],
  },
  {
    key: 'mainDataManage',
    icon: 'global',
    children: [
      {
        key: 'customerManage',
      },
      {
        key: 'projectGroupManage',
      },
      {
        key: 'stationManage',
        visibilityChild: 'hidden',
        children: [
          { key: 'rosRule' },
          { key: 'rulerEdit',subModule: 'common-ros' },
          { key: 'stationDetail' },
        ],
      },
      {
        key: 'stationGroupManage',
      },
      {
        key: 'supplierManage',
      },
      {
        key: 'truckTypeManage',
      },
      {
        key: 'truckManage',
      },
      {
        key: 'otherTransManage',
      },
      {
        key: 'personalManage',
      },
      {
        key: 'skuManage',
      },
      {
        key: 'ProductManage',
      },
      {
        key: 'ServiceRangeManage',
      },
      {
        key: 'medicinePrice',
      },
      {
        key: 'SupplierMarketingManage',
      },
      {
        key: 'ScheduleManage',
      }
    ],
  },
  {
    key: 'rule',
    icon: 'control',
    children: [
      {
        key: 'splitRule',
        visibilityChild: 'hidden',
        children: [
          { key: 'splitRuleDetail' },
        ],
      },
      {
        key: 'fixedRulesManage',
        visibilityChild: 'hidden',
        children: [
          { key: 'fixedRuleDetail' },
          { key: 'fixedRulePreSchedule' },
        ],
      },
      { key: 'deployManage',
        visibilityChild: 'hidden',
        children: [
          {
            key: 'deployDetail',
            visibilityChild: 'hidden',
            children: [
              { key: 'requirementTemplateConfig' },
              { key: 'settlementPayDeploy' }
            ]
          },
        ],
      },
      {
        key: 'orderAutoRule',
      }
    ],
  },
  {
    key: 'settleAccountsManage',
    icon: 'pay-circle',
    children: [
      {
        key: 'customerSettlement',
      },
      {
        key: 'supplierSettlement',
      },
      {
        key: 'receivableTurnover',
      },
      {
        key: 'payableTurnover',
      },
      {
        key: 'receivableFeeManage',
        visibilityChild: 'hidden',
        children: [{
          key: 'payableFeeDetail',
        }],
      },
      {
        key: 'payableFeeManage',
        visibilityChild: 'hidden',
        children: [{
          key: 'payableFeeDetail',
        }],
      },
      {
        key: 'billManage',
      }, {
        key: 'transportBox',
      },
      {
        key: 'standardSettlementRule',
      },
      {
        key: 'medicineBilingInfoManage',
      }
    ],
  },
];

const subMenuArray = [subMenu1]

function getCompleteMenu(mainMenu, subMenuArr){
  const mainMenuCopy = JSON.parse(JSON.stringify(mainMenu))
  const menuMap = new Map();

  // 按照路径缓存
  function getSubMenuCache(subMenu){
    for(let i = 0; i < subMenu.length; i++) {
      if('route' in subMenu[i]) {
        if(!('path' in subMenu[i].route)) {
          subMenu[i].route.path = ''
        }
        if(menuMap.has(subMenu[i].route.path)){
          const tmp = menuMap.get(subMenu[i].route.path)
          tmp.push(subMenu[i])
          menuMap.set(subMenu[i].route.path, tmp)
        } else {
          menuMap.set(subMenu[i].route.path, [subMenu[i]])
        }
      }
    }
  }
  for(let i = 0; i < subMenuArr.length; i++) {
    getSubMenuCache(subMenuArr[i])
  }

  //对缓存的menu排序并插入
  function menuIndexSort(arr){
    // 如果第二个值比第一个值小则交换 -> 升序排列
    return arr.sort((sec, fir) => sec.route.index - fir.route.index)
  }
  menuMap.forEach((value, key) => {
    const firstValueRoute = value[0].route
    const keyArr = key.split('/').filter(item => item !== '');
    let node = mainMenuCopy;
    for(let i = 0; i < keyArr.length; i++){
      // 下钻到对应节点
      for(let j = 0; j < node.length; j++){
        if(node[j].key === keyArr[i]){
          node = node[j].children
          break;
        }
      }
      console.log('node: ', node);
    }
    // 在当前节点找到锚定点
    let anchor = 0;
    const anchorValue = firstValueRoute.before || firstValueRoute.after
    for(let i = 0; i < node.length; i++){
      if(node[i].key === anchorValue) {
        anchor = i
        break
      }
    }
    // 分开前插和后插的数据
    function insertFilter(arr, positon){
      return arr.filter((item => positon in item.route))
    }
    const beforeInsertArr = insertFilter(value, 'before')
    const afterInsertArr = insertFilter(value, 'after')
    
    // 排序并做适当的赋值处理,为插入作准备
    function sortAndassign(arr){
      const insertMenuArr = menuIndexSort(arr)
      insertMenuArr.forEach(item => {
        item.routeType = 'micro'
      })
      return insertMenuArr;
    }
   
    // 插入
    node.splice(anchor, 0, ...sortAndassign(beforeInsertArr))
    node.splice(anchor + 1 + beforeInsertArr.length, 0, ...sortAndassign(afterInsertArr))

  })
  return mainMenuCopy
}

console.log(JSON.stringify(getCompleteMenu(menu, subMenuArray)))


// todo
// 1. 将所有子项目的menu传到主项目（查看传过去的auth是具体的code码吗）
