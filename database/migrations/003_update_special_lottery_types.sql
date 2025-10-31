-- 更新特殊彩票类型的分类
-- 执行日期: 2025-10-31

-- 1. 港式彩票 (Hong Kong Style) - 18种
UPDATE lottery_types
SET 
  lottery_type = 'hong_kong_style',
  prize_structure = jsonb_build_object(
    'main', '主要号码（3位数）',
    'extra', '附加号码（2位数）'
  ),
  updated_at = NOW()
WHERE lottery_code IN (
  'BFHN', 'CQHN', 'GSCNA', 'GSCNP', 'GSDE', 'GSEG',
  'GSHKA', 'GSHKP', 'GSIN', 'GSJPA', 'GSJPB', 'GSSGP',
  'GSTW', 'GSUSA', 'JX300', 'LLYG', 'MX300', 'TW5FC'
);

-- 2. 泰国政府彩票 (Thai Government) - 1种
UPDATE lottery_types
SET 
  lottery_type = 'thai_government',
  prize_structure = jsonb_build_object(
    'first', '一等奖',
    'second', '二等奖',
    'third', '三等奖',
    'fourth', '四等奖'
  ),
  updated_at = NOW()
WHERE lottery_code = 'TGFC';

-- 3. 带后缀号码的彩票 - 3种
UPDATE lottery_types
SET 
  lottery_type = 'suffix_numbers',
  prize_structure = jsonb_build_object(
    'main', '主要号码',
    'last2', '后2位',
    'last3', '后3位',
    'pre2', '前2位'
  ),
  updated_at = NOW()
WHERE lottery_code IN ('TLZC', 'YNHN', 'YNMA');

-- 4. TYKC - 特殊后缀格式
UPDATE lottery_types
SET 
  lottery_type = 'suffix_numbers',
  prize_structure = jsonb_build_object(
    'main', '主要号码',
    'last3', '后3位',
    'mid2', '中间2位'
  ),
  updated_at = NOW()
WHERE lottery_code = 'TYKC';

-- 5. ZCVIP - 特殊格式
UPDATE lottery_types
SET 
  lottery_type = 'special_multi',
  prize_structure = jsonb_build_object(
    'main', '主要号码',
    'code2', '第二组号码',
    'last2', '后2位',
    'last3', '后3位',
    'last4', '后4位'
  ),
  updated_at = NOW()
WHERE lottery_code = 'ZCVIP';

-- 6. MAX3D - 特殊多段式
UPDATE lottery_types
SET 
  lottery_type = 'special_multi',
  prize_structure = jsonb_build_object(
    'group1', '第一组',
    'group2', '第二组',
    'group3', '第三组',
    'special', '特别号'
  ),
  updated_at = NOW()
WHERE lottery_code = 'MAX3D';

-- 7. BAAC - 泰国储蓄彩票 (最复杂)
UPDATE lottery_types
SET 
  lottery_type = 'special_multi',
  prize_structure = jsonb_build_object(
    'main', '主要号码',
    'prize0', '特等奖',
    'prize1', '一等奖',
    'prize2', '二等奖',
    'prize3', '三等奖',
    'prize4', '四等奖',
    'prize5', '五等奖',
    'prize6', '六等奖',
    'prize7', '七等奖',
    'prize8', '八等奖',
    'last3', '后3位',
    'last3_1', '后3位（副）',
    'last4', '后4位'
  ),
  updated_at = NOW()
WHERE lottery_code = 'BAAC';

-- 8. 泰国GSB彩票系列 - 如果存在的话
UPDATE lottery_types
SET 
  lottery_type = 'thai_government',
  prize_structure = jsonb_build_object(
    'main', '主要号码',
    'extra', '附加号码'
  ),
  updated_at = NOW()
WHERE lottery_code IN ('GSB3Y', 'GSB5Y')
  AND lottery_type = 'standard';

-- 验证更新结果
SELECT 
  lottery_type,
  COUNT(*) as count,
  STRING_AGG(lottery_code, ', ' ORDER BY lottery_code) as codes
FROM lottery_types
WHERE lottery_type IN (
  'hong_kong_style',
  'thai_government',
  'suffix_numbers',
  'special_multi'
)
GROUP BY lottery_type
ORDER BY lottery_type;

