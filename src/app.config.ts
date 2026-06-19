export default defineAppConfig({
  pages: [
    'pages/report/index',
    'pages/feedback/index',
    'pages/risks/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E40AF',
    navigationBarTitleText: '境外舆情快报',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F1F5F9'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/report/index',
        text: '发现线索'
      },
      {
        pagePath: 'pages/feedback/index',
        text: '查看反馈'
      },
      {
        pagePath: 'pages/risks/index',
        text: '风险提示'
      }
    ]
  }
})
