/**
 * 彩票Logo图片上传脚本
 * 将官方采集源的图片下载并上传到 Supabase 存储桶
 */

import dotenv from 'dotenv'
import path from 'path'
import https from 'https'
import http from 'http'
import { URL } from 'url'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

// 加载环境变量（必须在其他导入之前）
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// 创建 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 彩票代码到官方图片URL的映射
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

const BASE_URL = 'https://vip.manycai.com'
const BUCKET_NAME = 'lottery-logos'
const TEMP_DIR = path.join(process.cwd(), 'temp-images')

// 创建临时目录
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true })
}

// 下载图片
async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http

    const file = fs.createWriteStream(filepath)
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed to download ${url}: ${response.statusCode}`)
        resolve(false)
        return
      }

      response.pipe(file)
      
      file.on('finish', () => {
        file.close()
        resolve(true)
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      console.error(`Error downloading ${url}:`, err.message)
      resolve(false)
    })
  })
}

// 上传图片到 Supabase Storage
async function uploadToSupabase(
  lotteryCode: string, 
  localPath: string
): Promise<string | null> {
  try {
    const fileExt = path.extname(localPath)
    const fileName = `${lotteryCode}${fileExt}`
    const fileBuffer = fs.readFileSync(localPath)

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: fileExt === '.jpg' ? 'image/jpeg' : 'image/png',
        upsert: true // 如果文件存在则覆盖
      })

    if (error) {
      console.error(`Failed to upload ${fileName}:`, error.message)
      return null
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    console.log(`✅ Uploaded: ${lotteryCode} -> ${urlData.publicUrl}`)
    return urlData.publicUrl
  } catch (error: any) {
    console.error(`Error uploading ${lotteryCode}:`, error.message)
    return null
  }
}

// 主函数
async function main() {
  console.log('🚀 Starting lottery images upload to Supabase...\n')
  
  // 检查 bucket 是否存在，不存在则创建
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)
  
  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}`)
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
    })
    
    if (error) {
      console.error('Failed to create bucket:', error)
      return
    }
    console.log('✅ Bucket created successfully\n')
  } else {
    console.log(`✅ Bucket ${BUCKET_NAME} already exists\n`)
  }

  const results: Record<string, string> = {}
  let successCount = 0
  let failCount = 0
  const total = Object.keys(LOTTERY_IMAGE_URLS).length

  // 处理每个图片
  for (const [lotteryCode, imagePath] of Object.entries(LOTTERY_IMAGE_URLS)) {
    const imageUrl = `${BASE_URL}${imagePath}`
    const fileExt = path.extname(imagePath)
    const localPath = path.join(TEMP_DIR, `${lotteryCode}${fileExt}`)

    console.log(`[${successCount + failCount + 1}/${total}] Processing: ${lotteryCode}`)

    // 下载图片
    const downloaded = await downloadImage(imageUrl, localPath)
    if (!downloaded) {
      failCount++
      continue
    }

    // 上传到 Supabase
    const publicUrl = await uploadToSupabase(lotteryCode, localPath)
    if (publicUrl) {
      results[lotteryCode] = publicUrl
      successCount++
    } else {
      failCount++
    }

    // 删除临时文件
    try {
      fs.unlinkSync(localPath)
    } catch (e) {}

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // 清理临时目录
  try {
    fs.rmdirSync(TEMP_DIR)
  } catch (e) {}

  // 保存结果到文件
  const outputPath = path.join(process.cwd(), 'lottery-image-urls.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

  console.log('\n' + '='.repeat(60))
  console.log('📊 Upload Summary:')
  console.log(`   Total: ${total}`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log(`\n💾 Results saved to: ${outputPath}`)
  console.log('='.repeat(60))
}

// 运行
main().catch(console.error)

