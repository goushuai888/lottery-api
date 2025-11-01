// 彩票图标组件
// 为每个彩票提供对应的图标或 emoji 标识

interface LotteryIconProps {
  lotteryCode: string
  lotteryName: string
  size?: 'sm' | 'md' | 'lg'
}

// 彩票代码到官方图片URL的映射（从采集源获取）
const LOTTERY_IMAGE_URLS: Record<string, string> = {
  // 高频彩种
  'CQSSC': '/static/uploads/lottery/922206b0b9658a2572fc9cd6b7d75037.png',
  'XJSSC': '/static/uploads/lottery/f0776734d4ebc4d46369885a2dc39419.png',
  'SHSSL': '/static/uploads/lottery/434cf4172430ea6f54933c2f20873cb8.png',
  'TJSSC': '/static/uploads/lottery/e126dc8a406cd6cf936c510d1066b0e0.png',
  'BJKL8': '/static/uploads/lottery/1010683c9568894644881a2ff7bd4e95.png',
  'BJPK10': '/static/uploads/lottery/843388e64200a1a45e4ab19f0229d400.png',
  'JSKS': '/static/uploads/lottery/2ee60ed7ba0cc4a00b58902462ba7d0f.png',
  'JLK3': '/static/uploads/lottery/06af4434123d184feb4fe9373d20e00c.png',
  'AHK3': '/static/uploads/lottery/3e451be303fb5ea7bb4e8764309f8642.png',
  'HLK3': '/static/uploads/lottery/8df8fe5c9a594c92f83ede56bc6cd145.png',
  'HBK3': '/static/uploads/lottery/4f19dd4e7b81afcbf80a944dc76f959f.png',
  'SH11X5': '/static/uploads/lottery/a16a5a661b42c89af7813ed26b5f3c87.png',
  'JS11X5': '/static/uploads/lottery/d528526068993806535380929b3f44eb.png',
  'SD11X5': '/static/uploads/lottery/7c934a8cf59e82bf44a36a2967beadd0.png',
  'GX11X5': '/static/uploads/lottery/706b6402000e4dcccabd04834d6e1fe0.png',
  'AF11X5': '/static/uploads/lottery/70a6ea5d1721c064b716c83cd9c67cc4.png',
  'GD11X5': '/static/uploads/lottery/ccbaac644307c3f40b30b2252a5bc791.png',
  'JX11X5': '/static/uploads/lottery/b77cd4429a87b3aa2279b74ffdfb747a.png',
  'HB11X5': '/static/uploads/lottery/d6a81370aca0c688b6b9e41fc351a563.png',
  'LL11X5': '/static/uploads/lottery/e334d9b7338ef11ad9ecc5e66e032dee.png',
  'YN11X5': '/static/uploads/lottery/1b367f1040b6149e16973ea5a06ce75a.png',
  'HLJ11X5': '/static/uploads/lottery/e26a2e24545ad6215838f42374954da9.png',
  'HNKL10': '/static/uploads/lottery/0d632e22fafa01e8acf8a5d6f77ad045.png',
  'TJKL10': '/static/uploads/lottery/b53fba10fa617e6740b3838be5a6c2d1.png',
  'GXKL10': '/static/uploads/lottery/1aa5c94af3578195c7eb40ead3ef58a0.png',
  'GDKL10': '/static/uploads/lottery/0a204fdd157b8b1a94e7e2180216096b.png',
  'SCKL12': '/static/uploads/lottery/48022726e1f8f02b30a2c696e9b16b4e.png',
  'CQXYNC': '/static/uploads/lottery/848bb9b89e5ee345a13afe8a6a94267b.png',
  'XYFT': '/static/uploads/lottery/d2ac1e5a561f8eec90606b44664712fc.png',
  'GXKS': '/static/uploads/lottery/1348bf8e3caeab5fb7124db5cb3a0113.png',
  'CQ5FC': '/static/uploads/lottery/77395f48c4bccaaabeb2a4549baa9a03.png',
  'CQFFC': '/static/uploads/lottery/73153cf6ebbbe898a88b91ce71795131.png',
  'JDCQSSC': '/static/uploads/lottery/b3814dddd26da70d23ae3682313654c3.png',
  'XIYFT': '/static/uploads/lottery/e23af94fbfea0a86240d2e6878820359.png',

  // 低频彩种
  'XGLHC': '/static/uploads/lottery/a2a617328605be0b01029cfef1506804.png',
  'FC3D': '/static/uploads/lottery/71c39a14c33ee23a7361caaef2a66183.png',
  'TCPL3': '/static/uploads/lottery/be22ca12453390cde958b36f14fb6f6d.png',
  'TCPL5': '/static/uploads/lottery/087f4d4b7f177dee77921c2025df70df.png',
  'MOLHC': '/static/uploads/lottery/e57e90c22334e4ce093918750b0bb85c.png',

  // 极速彩种
  'MCPK10': '/static/uploads/lottery/f1d45b07fbdfb00e43d4092b96ac1639.png',
  'XGPK10': '/static/uploads/lottery/ebd2e13092c6bd5560ff3cabb0f1ac2f.png',
  'CQSSC30S': '/static/uploads/lottery/ed70a94f1d9930fb154988f070ee6e57.png',
  'TXFFC30S': '/static/uploads/lottery/60f96a5a85235a7b2881c7fc338131ec.png',
  'QQ30S': '/static/uploads/lottery/10a701a0b7d56e252b095c842b23f5cc.png',

  // 境外彩种
  'AZXY8': '/static/uploads/lottery/31cc98893ffc03f55a3036cdbcaf82a2.png',
  'AZXY20': '/static/uploads/lottery/eaef88b28077b681f0605fdddc75c778.png',
  'AZXY5': '/static/uploads/lottery/4db2a302030b4f797848fd29066978a8.png',
  'AZXY10': '/static/uploads/lottery/6f8a4bec379a82f81c4b7ccf8db0d9dd.png',
  'TG11X5': '/static/uploads/lottery/857a6ae02450671f3512d5de243e81b6.png',
  'TG11X5FFC': '/static/uploads/lottery/4f42a28bb058c2a725740c6017e65041.jpg',
  'HN300': '/static/uploads/lottery/4b2605f12843c7e288ef936364cb940f.png',
  'HN60': '/static/uploads/lottery/90970d033fcd63e46fd7bdf6ba36cc68.png',
  'RD120': '/static/uploads/lottery/3e50a0f9db02bfaeb414ffb0dbc40bfa.png',
  'RD60': '/static/uploads/lottery/34abb1dc34745fed6455a526f8e37799.png',
  'TG300': '/static/uploads/lottery/534b5d4ea033319ff9357f46298ffa1e.png',
  'TG60': '/static/uploads/lottery/d1722dae550f589e6a80c19f5294bb15.png',
  'YN60': '/static/uploads/lottery/fc676d6e10a7b5d2b3fb4bc6d23b15cb.png',
  'YN300': '/static/uploads/lottery/809ccd7ed9cdd3c69c3f738a844c34b7.png',
  'XG60': '/static/uploads/lottery/5a21c1291f9aee0a0874eeaecd9085e4.png',
  'XG300': '/static/uploads/lottery/6d3ce1e1303ad102c17e4869413e2f45.png',
  'RB60': '/static/uploads/lottery/02e1f7c8c6f8b6810322b9a50afda718.png',
  'VNFFC': '/static/uploads/lottery/d58d6cd79884da602b45fd68a7682335.png',
  'VNWFC': '/static/uploads/lottery/c423456e25e8e2781d07d6f6fe912bc1.png',
  'JND30S': '/static/uploads/lottery/be4387a46414b0fe6901b960ee4fe59f.png',
  'MNG52': '/static/uploads/lottery/d8cf1a5b6cf15274edd996798e0d8021.png',
  'JND11X5': '/static/uploads/lottery/d1f60b722c437e64f7fba186750d0161.png',
  'JND3D': '/static/uploads/lottery/d80f077132fc3cda69a662c2f404b9f8.png',
  'JSSM': '/static/uploads/lottery/3ca4637f7cbf50d635c3d8b38a93ca8e.png',
  'YNPK10FFC': '/static/uploads/lottery/326865fd8444d7d5cf98ae7bf52874fe.jpg',
  'YNPK10WFC': '/static/uploads/lottery/1976a195e732e7f656ed5eba618ed9b2.jpg',
  'MAX3D': '/static/uploads/lottery/99102621c416ee90d6e5eee077ef48bf.png',
  'MEGA645FFC': '/static/uploads/lottery/f494a9f4ff3367bdb4d53b0416e7734b.png',
  'MEGA6455FC': '/static/uploads/lottery/467e1359df34efd7b65fcc2a14fd2b9b.png',

  // 计算型彩种
  'TXFFC': '/static/uploads/lottery/4d1acbce879b31e9f467de57787a79d3.png',
  'QQFFC': '/static/uploads/lottery/cd26cfc638242578039da42808906f73.png',
  'TX2FCS': '/static/uploads/lottery/c07fa265929b5a1c59a675ba9035fb0d.png',
  'TX2FCD': '/static/uploads/lottery/74656257fbeb251c040e410559228740.png',
  'TX5FC': '/static/uploads/lottery/42a241b3d57f5491ae088a385eb3d627.png',
  'TXPK10': '/static/uploads/lottery/f3596daed7de7c624266a1c86b862b63.png',
  'QIQFFC': '/static/uploads/lottery/3f833b5b623970de39777e696192f9e8.jpg',
  'BTCFFC': '/static/uploads/lottery/86156aea2597cd904daad3e79958bdce.png',
  'ZFBFFC': '/static/uploads/lottery/5f73e3f5bf2e3116db71dbd9d47b4914.png',
  'ZFB5FC': '/static/uploads/lottery/99c7f6f7c2ddd1945942e08b91602c78.png',
  'BTC5FC': '/static/uploads/lottery/42c8860d84d6a8ee672985ed9830a79d.png',
  'BABTCFFC': '/static/uploads/lottery/4f0f1e501e4c5cefedd241ee1653d0ae.png',
  'BABTC5FC': '/static/uploads/lottery/f989bed2d898262d5a3fd9442497ccfa.png',
  'BAETFFC': '/static/uploads/lottery/a3b3b1e4ec70ec90d8243df12d14753a.png',
  'BAET5FC': '/static/uploads/lottery/b78176d4b023a3a7a3b3739b3066d3c5.png',
  'OEBTCFFC': '/static/uploads/lottery/560eb561e2b4977af9577bc427200122.png',
  'OEBTC5FC': '/static/uploads/lottery/d7fd08ebc969d96b94389b041fc64149.png',
  'OEETFFC': '/static/uploads/lottery/68fb38c946f2947ba033c0459c5eb91b.png',
  'OEET5FC': '/static/uploads/lottery/a43f71f97979ea9ad48aff68edf6e2b7.png',
  'HASHFFC': '/static/uploads/lottery/4283a6f8b0019908c92fe6b25a418343.png',
  'HASH3FC': '/static/uploads/lottery/d0d331c7c6a8442c54f31baabdbba548.png',
  'HASH5FC': '/static/uploads/lottery/06e5a68654352435cb6a851d3e509481.png',
  'ETFFC': '/static/uploads/lottery/0e1358331e667af158d7a3b99a846fd6.png',
  'NEWHASHFFC': '/static/uploads/lottery/14eedae310a619165a26e9aa32d6a009.png',
  'NEWHASH3FC': '/static/uploads/lottery/f040052c468d9acc72e650531c2eb8dd.png',
  'NEWHASH5FC': '/static/uploads/lottery/16e6939e136470ae5d235507c07f9f3b.png',
  'TRX30S': '/static/uploads/lottery/e55b7bf4b8fb47dc00dce0151be6f5f6.png',
  'ET3FC': '/static/uploads/lottery/d221bd7905d73dabca8ddaea259ca64e.png',
  'ET5FC': '/static/uploads/lottery/5cb61e16efac3bc36d3428a1d2d2377a.png',
}

// Emoji备用图标映射（当没有真实图片时使用）
const LOTTERY_ICONS: Record<string, string> = {
  // 高频彩种
  'CQSSC': '🎰',      // 欢乐生肖
  'XJSSC': '🎲',      // 新疆时时彩
  'SHSSL': '🎯',      // 上海时时乐
  'TJSSC': '🎪',      // 天津时时彩
  'BJKL8': '🎱',      // 北京快乐8
  'BJPK10': '🏎️',     // 北京PK10
  'JSKS': '🎮',       // 江苏快三
  'JLK3': '🎲',       // 吉林快3
  'AHK3': '🎲',       // 安徽快3
  'HLK3': '🎲',       // 河南快3
  'HBK3': '🎲',       // 湖北快3
  'GXKS': '🎲',       // 广西快3
  'SH11X5': '🔢',     // 上海11选5
  'JS11X5': '🔢',     // 江苏11选5
  'SD11X5': '🔢',     // 山东11选5
  'GX11X5': '🔢',     // 广西11选5
  'AF11X5': '🔢',     // 安徽11选5
  'GD11X5': '🔢',     // 广东11选5
  'JX11X5': '🔢',     // 江西11选5
  'HB11X5': '🔢',     // 湖北11选5
  'LL11X5': '🔢',     // 辽宁11选5
  'YN11X5': '🔢',     // 云南11选5
  'HLJ11X5': '🔢',    // 黑龙江11选5
  'HNKL10': '🎊',     // 湖南快乐十分
  'TJKL10': '🎊',     // 天津快乐十分
  'GXKL10': '🎊',     // 广西快乐十分
  'GDKL10': '🎊',     // 广东快乐十分
  'SCKL12': '🎊',     // 四川快乐12
  'CQXYNC': '🌾',     // 重庆幸运农场
  'XYFT': '✈️',       // 皇家幸运飞艇
  'XIYFT': '✈️',      // 幸运飞艇
  'CQ5FC': '⏱️',      // 重庆五分彩
  'CQFFC': '⚡',      // 重庆分分彩
  'JDCQSSC': '🎰',    // 经典重庆时时彩

  // 低频彩种
  'XGLHC': '🇭🇰',     // 香港六合彩
  'MOLHC': '🇲🇴',     // 澳门六合彩
  'FC3D': '🎲',       // 福彩3D
  'TCPL3': '🎲',      // 体彩排列3
  'TCPL5': '🎲',      // 体彩排列5

  // 极速彩种
  'MCPK10': '🏁',     // 极速赛车
  'XGPK10': '🏎️',     // 香港PK10
  'CQSSC30S': '⚡',   // 多彩重庆30秒
  'TXFFC30S': '⚡',   // 多彩腾讯30秒
  'QQ30S': '🐧',      // QQ30秒

  // 境外彩种 - 澳洲系列
  'AZXY5': '🇦🇺',     // 澳洲幸运5
  'AZXY8': '🇦🇺',     // 澳洲幸运8
  'AZXY10': '🇦🇺',    // 澳洲幸运10
  'AZXY20': '🇦🇺',    // 澳洲幸运20

  // 境外彩种 - 泰国系列
  'TGFC': '🇹🇭',      // 泰国政府彩票
  'BAAC': '🇹🇭',      // 泰国BAAC储蓄彩票
  'TG11X5': '🇹🇭',    // 泰国11选5
  'TG11X5FFC': '🇹🇭', // 泰国分分11选5
  'TG300': '🇹🇭',     // 泰国300秒
  'TG60': '🇹🇭',      // 泰国60秒
  'TLZC': '🇹🇭',      // 泰国老挝彩票
  'TYKC': '🇹🇭',      // 泰国Yee Kee VIP
  'GSTH': '🇹🇭',      // 泰国股市彩票

  // 境外彩种 - 越南系列
  'HNC': '🇻🇳',       // 越南传统彩-河内
  'BNC': '🇻🇳',       // 越南传统彩-北宁
  'HFC': '🇻🇳',       // 越南传统彩-海防
  'NDC': '🇻🇳',       // 越南传统彩-南定
  'GNIC': '🇻🇳',      // 越南传统彩-广宁
  'TPC': '🇻🇳',       // 越南传统彩-太平
  'PDC': '🇻🇳',       // 越南传统彩-平定
  'XXC': '🇻🇳',       // 越南传统彩-岘港
  'DOLC': '🇻🇳',      // 越南传统彩-多乐
  'DNC': '🇻🇳',       // 越南传统彩-达农
  'JLC': '🇻🇳',       // 越南传统彩-嘉莱
  'QHC': '🇻🇳',       // 越南传统彩-庆和
  'KGC': '🇻🇳',       // 越南传统彩-昆嵩
  'LSC': '🇻🇳',       // 越南传统彩-宁顺
  'GPC': '🇻🇳',       // 越南传统彩-广平
  'GNC': '🇻🇳',       // 越南传统彩-广南
  'GYC': '🇻🇳',       // 越南传统彩-广义
  'GZC': '🇻🇳',       // 越南传统彩-广治
  'FAC': '🇻🇳',       // 越南传统彩-富安
  'SFC': '🇻🇳',       // 越南传统彩-承天顺化
  'FZMSC': '🇻🇳',     // 越南传统彩-胡志明市
  'AJC': '🇻🇳',       // 越南传统彩-安江
  'BLC': '🇻🇳',       // 越南传统彩-薄辽
  'BZC': '🇻🇳',       // 越南传统彩-槟椥
  'PYC': '🇻🇳',       // 越南传统彩-平阳
  'PFC': '🇻🇳',       // 越南传统彩-平福
  'PSC': '🇻🇳',       // 越南传统彩-平顺
  'JOC': '🇻🇳',       // 越南传统彩-金瓯
  'JYC': '🇻🇳',       // 越南传统彩-芹苴
  'DLC': '🇻🇳',       // 越南传统彩-大叻
  'TNC': '🇻🇳',       // 越南传统彩-同奈
  'TTC': '🇻🇳',       // 越南传统彩-同塔
  'HJC': '🇻🇳',       // 越南传统彩-后江
  'JJC': '🇻🇳',       // 越南传统彩-建江
  'LAC': '🇻🇳',       // 越南传统彩-隆安
  'SZC': '🇻🇳',       // 越南传统彩-溯庄
  'XLC': '🇻🇳',       // 越南传统彩-西宁
  'QJC': '🇻🇳',       // 越南传统彩-前江
  'CRC': '🇻🇳',       // 越南传统彩-茶荣
  'YLC': '🇻🇳',       // 越南传统彩-永隆
  'TDC': '🇻🇳',       // 越南传统彩-头顿
  'HN300': '🇻🇳',     // 河内五分彩
  'HN60': '🇻🇳',      // 河内分分彩
  'VNFFC': '🇻🇳',     // 越南极速1分彩
  'VNWFC': '🇻🇳',     // 越南极速5分彩
  'YNHN': '🇻🇳',      // 越南河内套彩
  'HNVIP': '🇻🇳',     // 河内VIP彩票
  'BFHN': '🇻🇳',      // 北方河内彩票
  'CQHN': '🇻🇳',      // 抽签河内彩票
  'ZCVIP': '🇱🇦',     // 老挝VIP彩票
  'XG60': '🇻🇳',      // 西贡分分彩
  'XG300': '🇻🇳',     // 西贡五分彩

  // 境外彩种 - 其他国家
  'RD120': '🇸🇪',     // 瑞典2分彩
  'RD60': '🇸🇪',      // 瑞典1分彩
  'YN60': '🇮🇩',      // 印尼分分彩
  'YN300': '🇮🇩',     // 印尼五分彩
  'YNPK10FFC': '🇮🇩', // 印尼分分PK10
  'YNPK10WFC': '🇮🇩', // 印尼五分PK10
  'RB60': '🇯🇵',      // 日本分分彩
  'JND30S': '🇨🇦',    // 加拿大30秒
  'JND11X5': '🇨🇦',   // 加拿大11选5
  'JND3D': '🇨🇦',     // 加拿大3D
  'MNG52': '🇲🇨',     // 摩纳哥Super 52
  'JSSM': '🐎',       // 急速赛马
  'YNMA': '🇲🇾',      // 马来西亚套彩
  'MEGA645FFC': '🎯', // MEGA6/45分分彩
  'MEGA6455FC': '🎯', // MEGA6/45五分彩
  'MAX3D': '🎲',      // MAX3D

  // 境外彩种 - 股市彩票系列
  'GSHKA': '🇭🇰',     // 香港股市彩票-早市
  'GSHKP': '🇭🇰',     // 香港股市彩票-午市
  'GSTW': '🇹🇼',      // 台湾股市彩票
  'GSJPA': '🇯🇵',     // 日本股市彩票-早市
  'GSJPP': '🇯🇵',     // 日本股市彩票-午市
  'GSKR': '🇰🇷',      // 韩国股市彩票
  'GSCNA': '🇨🇳',     // 中国股市彩票-早市
  'GSCNP': '🇨🇳',     // 中国股市彩票-午市
  'GSSG': '🇸🇬',      // 新加坡股市彩票
  'GSIN': '🇮🇳',      // 印度股市彩票
  'GSEG': '🇪🇬',      // 埃及股市彩票
  'GSRU': '🇷🇺',      // 俄罗斯股市彩票
  'GSDE': '🇩🇪',      // 德国股市彩票
  'GSUK': '🇬🇧',      // 英国股市彩票
  'GSUS': '🇺🇸',      // 美国股市彩票

  // 计算型彩种
  'TXFFC': '💬',      // 腾讯分分彩
  'QQFFC': '🐧',      // QQ分分彩
  'TX2FCS': '💬',     // 腾讯2分彩-双
  'TX2FCD': '💬',     // 腾讯2分彩-单
  'TX5FC': '💬',      // 腾讯5分彩
  'TXPK10': '💬',     // 腾讯PK10
  'QIQFFC': '🎮',     // 奇趣分分彩
  'BTCFFC': '₿',      // 比特币分分彩
  'BTC5FC': '₿',      // 比特币五分彩
  'ZFBFFC': '💰',     // 支付宝分分彩
  'ZFB5FC': '💰',     // 支付宝5分彩
  'BABTCFFC': '₿',    // 币安比特币分分彩
  'BABTC5FC': '₿',    // 币安比特币五分彩
  'BAETFFC': '⟠',     // 币安以太币分分彩
  'BAET5FC': '⟠',     // 币安以太币五分彩
  'OEBTCFFC': '₿',    // 欧易比特币分分彩
  'OEBTC5FC': '₿',    // 欧易比特币五分彩
  'OEETFFC': '⟠',     // 欧易以太币分分彩
  'OEET5FC': '⟠',     // 欧易以太币五分彩
  'HASHFFC': '#️⃣',    // 哈希分分彩
  'HASH3FC': '#️⃣',    // 哈希三分彩
  'HASH5FC': '#️⃣',    // 哈希五分彩
  'ETFFC': '⟠',       // 以太坊分分彩
  'ET3FC': '⟠',       // 以太坊3分彩
  'ET5FC': '⟠',       // 以太坊5分彩
  'NEWHASHFFC': '#️⃣', // 新哈希分分彩
  'NEWHASH3FC': '#️⃣', // 新哈希三分彩
  'NEWHASH5FC': '#️⃣', // 新哈希五分彩
  'TRX30S': '🌊',     // 波场30秒彩
}

// 根据彩票名称获取颜色渐变
function getGradientColors(lotteryCode: string): string {
  // 根据彩票代码生成一致的颜色
  const hash = lotteryCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colorSchemes = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-red-400 to-red-600',
    'from-orange-400 to-orange-600',
    'from-yellow-400 to-yellow-600',
    'from-green-400 to-green-600',
    'from-teal-400 to-teal-600',
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
  ]
  return colorSchemes[hash % colorSchemes.length]
}

export default function LotteryIcon({ lotteryCode, lotteryName, size = 'md' }: LotteryIconProps) {
  const imageUrl = LOTTERY_IMAGE_URLS[lotteryCode]
  const icon = LOTTERY_ICONS[lotteryCode]
  const gradient = getGradientColors(lotteryCode)
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  }

  // 优先使用 Supabase 存储的图片
  if (imageUrl) {
    const fileExt = imageUrl.endsWith('.jpg') ? '.jpg' : '.png'
    // 使用环境变量配置的存储域名，支持自定义域名
    const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 
                          'https://ixqsqmftydqsibrjkuyc.supabase.co/storage/v1/object/public'
    const supabaseImageUrl = `${storageBaseUrl}/lottery-logos/${lotteryCode}${fileExt}`
    
    return (
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden shadow-md ring-2 ring-white dark:ring-gray-700`}>
        <img 
          src={supabaseImageUrl}
          alt={lotteryName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 图片加载失败时隐藏图片，显示备用方案
            e.currentTarget.style.display = 'none'
            const parent = e.currentTarget.parentElement
            if (parent) {
              parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold">${icon || lotteryName.charAt(0)}</div>`
            }
          }}
        />
      </div>
    )
  }

  // 使用 emoji 或首字母作为备用
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white shadow-md`}>
      {icon || lotteryName.charAt(0)}
    </div>
  )
}

