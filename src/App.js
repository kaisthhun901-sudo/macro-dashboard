import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

/* ═══════════════════ 원본 데이터 ═══════════════════ */

const RATE_HISTORY = [
  { date:"2021-01", kr:0.5,  us:0.25, y2:0.11, y10:1.07, y30:1.83 },
  { date:"2021-04", kr:0.5,  us:0.25, y2:0.16, y10:1.67, y30:2.34 },
  { date:"2021-07", kr:0.5,  us:0.25, y2:0.20, y10:1.30, y30:1.93 },
  { date:"2021-10", kr:0.75, us:0.25, y2:0.47, y10:1.61, y30:2.02 },
  { date:"2022-01", kr:1.25, us:0.25, y2:1.16, y10:1.79, y30:2.11 },
  { date:"2022-04", kr:1.50, us:0.50, y2:2.72, y10:2.89, y30:2.96 },
  { date:"2022-07", kr:2.25, us:2.50, y2:3.03, y10:2.93, y30:3.21 },
  { date:"2022-10", kr:3.00, us:3.25, y2:4.48, y10:4.01, y30:4.03 },
  { date:"2023-01", kr:3.50, us:4.50, y2:4.42, y10:3.52, y30:3.67 },
  { date:"2023-04", kr:3.50, us:5.00, y2:4.34, y10:3.57, y30:3.77 },
  { date:"2023-07", kr:3.50, us:5.50, y2:4.87, y10:3.97, y30:4.03 },
  { date:"2023-10", kr:3.50, us:5.50, y2:5.02, y10:4.93, y30:5.07 },
  { date:"2024-01", kr:3.50, us:5.50, y2:4.33, y10:3.97, y30:4.20 },
  { date:"2024-04", kr:3.50, us:5.50, y2:4.89, y10:4.68, y30:4.78 },
  { date:"2024-07", kr:3.50, us:5.50, y2:4.40, y10:4.09, y30:4.32 },
  { date:"2024-10", kr:3.25, us:5.00, y2:3.97, y10:4.28, y30:4.58 },
  { date:"2025-01", kr:3.00, us:4.50, y2:4.17, y10:4.54, y30:4.78 },
  { date:"2025-04", kr:2.75, us:4.50, y2:3.80, y10:4.21, y30:4.66 },
  { date:"2025-07", kr:2.50, us:4.50, y2:3.72, y10:4.15, y30:4.59 },
  { date:"2025-10", kr:2.50, us:4.00, y2:3.56, y10:3.99, y30:4.51 },
  { date:"2026-01", kr:2.50, us:3.75, y2:4.19, y10:4.62, y30:4.89 },
  { date:"2026-04", kr:2.50, us:3.75, y2:3.85, y10:4.39, y30:4.89 },
  { date:"2026-06", kr:2.50, us:3.75, y2:4.04, y10:4.46, y30:4.98 },
];

const LIQUIDITY_HISTORY = [
  { date:"2021-01", total:7395, reserves:3318, rrp:1,    tga:1619 },
  { date:"2021-07", total:8205, reserves:3963, rrp:860,  tga:720  },
  { date:"2022-01", total:8870, reserves:3920, rrp:1632, tga:178  },
  { date:"2022-07", total:8895, reserves:3200, rrp:2186, tga:611  },
  { date:"2023-01", total:8491, reserves:3002, rrp:2554, tga:447  },
  { date:"2023-07", total:8191, reserves:3254, rrp:1785, tga:623  },
  { date:"2024-01", total:7690, reserves:3518, rrp:576,  tga:782  },
  { date:"2024-07", total:7182, reserves:3310, rrp:400,  tga:815  },
  { date:"2025-01", total:6695, reserves:2902, rrp:60,   tga:640  },
  { date:"2025-04", total:6710, reserves:3050, rrp:42,   tga:612  },
  { date:"2025-07", total:6680, reserves:3050, rrp:38,   tga:650  },
  { date:"2025-10", total:6660, reserves:3000, rrp:30,   tga:700  },
  { date:"2026-01", total:6695, reserves:2902, rrp:60,   tga:640  },
  { date:"2026-04", total:6705, reserves:3040, rrp:40,   tga:620  },
  { date:"2026-06", total:6700, reserves:3067, rrp:38,   tga:650  },
];

const FX_HISTORY = [
  { date:"2021-01", usdkrw:1119, dxy:91.0,  jpy:104.1, eur:1.213 },
  { date:"2021-07", usdkrw:1154, dxy:92.8,  jpy:110.5, eur:1.187 },
  { date:"2022-01", usdkrw:1200, dxy:96.0,  jpy:114.5, eur:1.134 },
  { date:"2022-07", usdkrw:1310, dxy:106.5, jpy:134.9, eur:1.022 },
  { date:"2023-01", usdkrw:1264, dxy:102.5, jpy:130.0, eur:1.087 },
  { date:"2023-07", usdkrw:1299, dxy:102.0, jpy:141.2, eur:1.101 },
  { date:"2024-01", usdkrw:1330, dxy:103.5, jpy:147.2, eur:1.084 },
  { date:"2024-07", usdkrw:1381, dxy:104.4, jpy:157.8, eur:1.082 },
  { date:"2025-01", usdkrw:1470, dxy:108.0, jpy:155.2, eur:1.036 },
  { date:"2025-04", usdkrw:1430, dxy:99.6,  jpy:144.0, eur:1.135 },
  { date:"2025-07", usdkrw:1378, dxy:98.0,  jpy:148.8, eur:1.142 },
  { date:"2025-10", usdkrw:1430, dxy:99.0,  jpy:153.5, eur:1.163 },
  { date:"2026-01", usdkrw:1470, dxy:99.8,  jpy:153.1, eur:1.180 },
  { date:"2026-04", usdkrw:1490, dxy:98.2,  jpy:157.2, eur:1.168 },
  { date:"2026-06", usdkrw:1519, dxy:98.4,  jpy:159.4, eur:1.167 },
];

const MARKET_HISTORY = [
  { date:"2021-01", vix:21.6 },
  { date:"2021-07", vix:18.2 },
  { date:"2022-01", vix:24.8 },
  { date:"2022-07", vix:23.0 },
  { date:"2023-01", vix:18.7 },
  { date:"2023-07", vix:13.7 },
  { date:"2024-01", vix:13.3 },
  { date:"2024-07", vix:16.4 },
  { date:"2024-10", vix:19.8 },
  { date:"2025-01", vix:17.0 },
  { date:"2025-04", vix:31.8 },
  { date:"2025-07", vix:22.0 },
  { date:"2025-10", vix:18.5 },
  { date:"2026-01", vix:17.2 },
  { date:"2026-04", vix:24.5 },
  { date:"2026-06", vix:18.3 },
];

const COMMODITY_HISTORY = [
  { date:"2021-01", gold:1898, silver:25.7, copper:3.52, wti:52.2,  btc:35000  },
  { date:"2021-07", gold:1832, silver:25.3, copper:4.26, wti:72.0,  btc:41600  },
  { date:"2022-01", gold:1797, silver:22.6, copper:4.52, wti:83.2,  btc:38500  },
  { date:"2022-07", gold:1728, silver:18.7, copper:3.48, wti:99.5,  btc:23350  },
  { date:"2023-01", gold:1927, silver:23.5, copper:4.16, wti:80.5,  btc:23100  },
  { date:"2023-07", gold:1959, silver:24.7, copper:3.83, wti:82.0,  btc:29200  },
  { date:"2024-01", gold:2034, silver:22.9, copper:3.92, wti:72.5,  btc:42700  },
  { date:"2024-07", gold:2448, silver:29.3, copper:4.18, wti:76.8,  btc:62000  },
  { date:"2025-01", gold:2835, silver:30.5, copper:4.27, wti:76.3,  btc:98700  },
  { date:"2025-04", gold:3200, silver:32.8, copper:4.51, wti:62.5,  btc:83800  },
  { date:"2025-07", gold:3350, silver:36.0, copper:4.80, wti:67.0,  btc:95000  },
  { date:"2025-10", gold:2900, silver:31.5, copper:4.40, wti:70.0,  btc:87000  },
  { date:"2026-01", gold:2780, silver:30.8, copper:4.55, wti:73.5,  btc:98000  },
  { date:"2026-04", gold:3260, silver:33.5, copper:4.95, wti:68.0,  btc:103000 },
  { date:"2026-06", gold:3310, silver:32.1, copper:4.72, wti:65.8,  btc:105500 },
];

/* ═══════════════════ 유틸 함수 ═══════════════════ */

function filterByYears(history, years) {
  const last = history[history.length - 1];
  const anchor = new Date(last.date + "-01");
  const cutoff = new Date(anchor);
  cutoff.setFullYear(cutoff.getFullYear() - years);
  return history.filter(d => new Date(d.date + "-01") >= cutoff);
}

/* ═══════════════════ 지표 정의 ═══════════════════
   - rawData  : 참조할 전역 배열
   - field    : rawData 각 항목에서 꺼낼 키
   - fmt      : 화면 표시 포맷 함수
   - diffFmt  : 전월 대비 diff 포맷
   - interpret: 현재값 → 상태 문자열
   - statusColor: 현재값 → 색
   - detail   : 상세보기 내용
══════════════════════════════════════════════════ */

const INDICATORS = {
  kr_rate: {
    label:"한국 기준금리", unit:"%", color:"#f87171",
    rawData: RATE_HISTORY, field:"kr",
    fmt: v => v.toFixed(2)+"%",
    diffFmt: d => (d>0?"+":"")+d.toFixed(2)+"%p",
    interpret: v => v<=2?"완화 사이클":v<=3?"중립 영역":v<=4?"긴축 후반":"강한 긴축",
    statusColor: v => v<=2?"#34d399":v<=3?"#fbbf24":v<=4?"#fb923c":"#f87171",
    detail:{
      concept:"한국은행 금융통화위원회가 결정하는 기준금리입니다. 시중 대출·예금 금리의 기준이 되며, 경기와 물가를 조절하는 핵심 수단입니다.",
      levels:[
        { range:"0~1.5%",   color:"#34d399", label:"완화",   desc:"경기 부양 목적. 대출 쉽고 주식·부동산에 우호적이나 인플레 위험." },
        { range:"1.5~2.5%", color:"#fbbf24", label:"중립",   desc:"경기·물가 균형 추구. 자산시장 영향 중립." },
        { range:"2.5~3.5%", color:"#fb923c", label:"긴축",   desc:"물가 잡기 위한 긴축. 대출 비용 상승, 성장 둔화 압력." },
        { range:"3.5%+",    color:"#f87171", label:"강긴축", desc:"강한 긴축. 경기침체 위험 상승, 위험자산 하락 압력." },
      ],
      tip:"한·미 금리차를 함께 보세요. 한국이 미국보다 낮으면 원화 약세·자본유출 압력이 커집니다.",
    },
  },
  us_rate: {
    label:"미국 기준금리", unit:"%", color:"#60a5fa",
    rawData: RATE_HISTORY, field:"us",
    fmt: v => v.toFixed(2)+"%",
    diffFmt: d => (d>0?"+":"")+d.toFixed(2)+"%p",
    interpret: v => v<=1?"완화":v<=2.5?"중립":v<=4?"긴축 진행":"고긴축",
    statusColor: v => v<=1?"#34d399":v<=2.5?"#fbbf24":v<=4?"#fb923c":"#f87171",
    detail:{
      concept:"연방준비제도(Fed) FOMC가 결정하는 정책금리. 글로벌 금융시장에서 가장 영향력이 큰 금리로 달러 강약과 전 세계 자산시장에 파급됩니다.",
      levels:[
        { range:"0~1%",   color:"#34d399", label:"완화",   desc:"코로나 대응 수준. 유동성 풍부, 위험자산 강세 환경." },
        { range:"1~2.5%", color:"#fbbf24", label:"중립",   desc:"성장-물가 균형 추구 구간." },
        { range:"2.5~4%", color:"#fb923c", label:"긴축",   desc:"긴축 사이클. 주식 밸류에이션 압박 시작." },
        { range:"4%+",    color:"#f87171", label:"고긴축", desc:"2022~23년 사례. 신흥국·부채 많은 기업에 큰 부담." },
      ],
      tip:"FOMC 점도표(Dot Plot)와 함께 보면 미래 금리 경로를 예측할 수 있어요.",
    },
  },
  rate_spread: {
    label:"한·미 기준금리 차이", unit:"%", color:"#a3e635",
    rawData: RATE_HISTORY, field:"kr",  // field는 사용 안 하고 compute로 계산
    compute: d => parseFloat((d.kr - d.us).toFixed(2)),
    fmt: v => (v>0?"+":"")+v.toFixed(2)+"%p",
    diffFmt: d => (d>0?"+":"")+d.toFixed(2)+"%p",
    interpret: v => v>0.5?"한국이 높음":v>-0.5?"거의 동일":v>-1.5?"미국이 높음":"미국이 크게 높음",
    statusColor: v => v>0.5?"#34d399":v>-0.5?"#fbbf24":v>-1.5?"#fb923c":"#f87171",
    detail:{
      concept:"한국 기준금리에서 미국 기준금리를 뺀 값입니다. 양수(+)면 한국이 높고, 음수(-)면 미국이 높습니다. 원화 가치와 외국인 자금 흐름에 직접적인 영향을 줍니다.",
      levels:[
        { range:"+0.5%p 이상", color:"#34d399", label:"한국 우위",    desc:"원화 강세 지지. 외국인 자금 유입에 유리." },
        { range:"-0.5~+0.5%p", color:"#fbbf24", label:"균형",         desc:"금리차 영향 중립. 다른 변수(성장·지정학)가 환율 결정." },
        { range:"-1.5~-0.5%p", color:"#fb923c", label:"미국 우위",    desc:"달러 강세 압력. 원화 약세·자본유출 위험." },
        { range:"-1.5%p 이하",  color:"#f87171", label:"역전 심화",   desc:"1997년 수준에 근접. 강한 원화 약세 압력." },
      ],
      tip:"금리차가 -1%p 아래로 내려가면 외국인 채권 자금이 빠져나가고 원/달러 환율이 오르는 경향이 있습니다. 원화와 함께 체크하세요.",
    },
  },
  term_spread: {
    label:"장단기 금리차", unit:"%", color:"#34d399",
    rawData: RATE_HISTORY, field:"y10",
    compute: d => parseFloat((d.y10 - d.y2).toFixed(2)),
    fmt: v => (v>0?"+":"")+v.toFixed(2)+"%p",
    diffFmt: d => (d>0?"+":"")+d.toFixed(2)+"%p",
    interpret: v => v>1?"정상 우상향":v>0?"완만한 정상":v>-0.5?"역전 초기":"역전 심화",
    statusColor: v => v>1?"#34d399":v>0?"#fbbf24":v>-0.5?"#fb923c":"#f87171",
    detail:{
      concept:"미국 10년물 금리에서 2년물 금리를 뺀 값입니다. 장기 채권 금리가 단기보다 높은 게 정상(우상향 곡선)이며, 역전되면 경기침체 신호로 해석됩니다.",
      levels:[
        { range:"+1%p 이상",    color:"#34d399", label:"정상 우상향", desc:"건강한 경기 확장 기대. 위험자산에 우호적." },
        { range:"0~+1%p",       color:"#fbbf24", label:"완만한 정상", desc:"경기 불확실성 존재. 중립 신호." },
        { range:"-0.5~0%p",     color:"#fb923c", label:"역전 초기",   desc:"경기 둔화 우려 시작. 과거 침체 선행 신호." },
        { range:"-0.5%p 이하",  color:"#f87171", label:"역전 심화",   desc:"역사적으로 1~2년 내 경기침체 발생한 구간." },
      ],
      tip:"2022~23년 역전폭이 -1%p를 넘어서며 역사상 가장 깊은 역전을 기록했습니다. 역전 해소 후 실제 침체가 오는 경우가 많으니 주의하세요.",
    },
  },
  us_2y: {
    label:"미국 2년물 금리", unit:"%", color:"#a78bfa",
    rawData: RATE_HISTORY, field:"y2",
    fmt: v => v.toFixed(2)+"%",
    diffFmt: d => (d>0?"+":"")+d.toFixed(2)+"%p",
    interpret: v => v<3?"완화 기대":v<4?"중립":v<5?"긴축 유지":"고긴축 예상",
    statusColor: v => v<3?"#34d399":v<4?"#fbbf24":v<5?"#fb923c":"#f87171",
    detail:{
      concept:"만기 2년짜리 미국 국채 금리. 연준의 가까운 미래 금리 정책에 가장 민감하게 반응합니다. '단기금리의 바로미터'라고 불립니다.",
      levels:[
        { range:"~2%",   color:"#34d399", label:"완화 기대", desc:"시장이 연준 금리 인하를 크게 기대하는 상태." },
        { range:"2~3.5%",color:"#fbbf24", label:"중립",      desc:"정상적인 금리 수준. 경기 안정 신호." },
        { range:"3.5~5%",color:"#fb923c", label:"긴축",      desc:"연준 긴축 기조 반영. 성장주 밸류에이션 압박." },
        { range:"5%+",   color:"#f87171", label:"고긴축",    desc:"2023년 최고점 수준. 경기침체 위험 내포." },
      ],
      tip:"2년물이 10년물보다 높으면 '장단기 역전' — 역사적으로 경기침체 12~18개월 전에 나타나는 신호입니다.",
    },
  },
  us_10y: {
    label:"미국 10년물 금리", unit:"%", color:"#c084fc",
    rawData: RATE_HISTORY, field:"y10",
    fmt: v => v.toFixed(2)+"%",
    diffFmt: d => (d>0?"+":"")+d.toFixed(2)+"%p",
    interpret: v => v<3?"저금리 완화":v<3.5?"역사 평균":v<4.5?"높은 수준":"초고금리",
    statusColor: v => v<3?"#34d399":v<3.5?"#fbbf24":v<4.5?"#fb923c":"#f87171",
    detail:{
      concept:"글로벌 금융시장의 '기준금리'로 불립니다. 주식 밸류에이션(PER), 모기지 금리, 회사채 스프레드 등 거의 모든 자산 가격의 기준점입니다.",
      levels:[
        { range:"~2.5%",  color:"#34d399", label:"저금리",    desc:"주식 PER 높아지는 환경. 성장주·부동산 유리." },
        { range:"2.5~3.5%",color:"#fbbf24",label:"중립",      desc:"장기 평균 수준. 자산시장 영향 중립." },
        { range:"3.5~4.5%",color:"#fb923c",label:"높은 수준", desc:"주식 경쟁력 약화. 채권이 매력적으로 보이기 시작." },
        { range:"4.5%+",  color:"#f87171", label:"초고금리",  desc:"주식·부동산 밸류에이션 압박. 현금 매력도 상승." },
      ],
      tip:"10년물 금리가 오르면 성장주(특히 나스닥)가 먼저 반응합니다. 금리와 주가는 역방향이 기본 법칙.",
    },
  },
  us_30y: {
    label:"미국 30년물 금리", unit:"%", color:"#f472b6",
    rawData: RATE_HISTORY, field:"y30",
    fmt: v => v.toFixed(2)+"%",
    diffFmt: d => (d>0?"+":"")+d.toFixed(2)+"%p",
    interpret: v => v<3.5?"완화 환경":v<4?"역사 평균":v<5?"높은 수준":"초고금리",
    statusColor: v => v<3.5?"#34d399":v<4?"#fbbf24":v<5?"#fb923c":"#f87171",
    detail:{
      concept:"30년 만기 미국 국채 금리. 장기 인플레이션 기대와 재정 부담을 반영합니다. 모기지(주택담보대출) 금리와 가장 직결됩니다.",
      levels:[
        { range:"~3%",  color:"#34d399", label:"완화",      desc:"부동산 시장에 우호적. 장기 인플레 우려 낮음." },
        { range:"3~4%", color:"#fbbf24", label:"중립",      desc:"역사적 평균 수준." },
        { range:"4~5%", color:"#fb923c", label:"높은 수준", desc:"주택 구매 부담 상승. 장기 재정 우려 반영." },
        { range:"5%+",  color:"#f87171", label:"초고금리",  desc:"1990년대 이후 거의 없던 수준. 극도의 재정 압박 신호." },
      ],
      tip:"30년물이 지속적으로 오르면 미국 재정 지속가능성에 대한 시장의 불신을 의미합니다.",
    },
  },
  usdkrw: {
    label:"원/달러", unit:"₩", color:"#fbbf24",
    rawData: FX_HISTORY, field:"usdkrw",
    fmt: v => "₩"+v.toLocaleString(),
    diffFmt: d => (d>0?"+":"")+Math.round(d)+"원",
    interpret: v => v<1150?"원화 강세":v<1300?"정상 범위":v<1450?"원화 약세":"고환율 위험",
    statusColor: v => v<1150?"#34d399":v<1300?"#fbbf24":v<1450?"#fb923c":"#f87171",
    detail:{
      concept:"1달러를 사는 데 필요한 원화 금액. 숫자가 오르면 원화 약세(달러가 비싸짐), 내리면 원화 강세입니다.",
      levels:[
        { range:"~1,150원",    color:"#34d399", label:"원화 강세",   desc:"수출기업 수익 감소 압력. 수입물가 하락." },
        { range:"1,150~1,300원",color:"#fbbf24",label:"정상",        desc:"역사적 평균 범위. 안정적." },
        { range:"1,300~1,450원",color:"#fb923c",label:"원화 약세",   desc:"수입물가 상승, 외국인 자금이탈 우려." },
        { range:"1,450원+",    color:"#f87171", label:"고환율 위험", desc:"1997 외환위기·2008 금융위기 수준. 물가·금융 안정 위협." },
      ],
      tip:"원/달러는 한국 수출주와 음의 상관관계. 환율이 오르면 수출 단가는 오르지만 외국인 매도 압력도 커집니다.",
    },
  },
  dxy: {
    label:"달러인덱스(DXY)", unit:"", color:"#38bdf8",
    rawData: FX_HISTORY, field:"dxy",
    fmt: v => v.toFixed(1),
    diffFmt: d => (d>0?"+":"")+d.toFixed(2),
    interpret: v => v<95?"달러 약세":v<100?"중립":v<105?"달러 강세":"초강달러",
    statusColor: v => v<95?"#34d399":v<100?"#fbbf24":v<105?"#fb923c":"#f87171",
    detail:{
      concept:"달러가 유로·엔·파운드 등 주요 6개 통화 대비 얼마나 강한지 보여주는 지수. 위험자산 전체에 영향을 미치는 '달러 온도계'입니다.",
      levels:[
        { range:"~95",   color:"#34d399", label:"약달러",   desc:"신흥국·원자재·위험자산에 우호적." },
        { range:"95~100",color:"#fbbf24", label:"중립",     desc:"대체로 안정적인 구간." },
        { range:"100~105",color:"#fb923c",label:"강달러",   desc:"신흥국 부담 상승. 한국 외국인 자금이탈 위험." },
        { range:"105+",  color:"#f87171", label:"초강달러", desc:"2022년 수준. 글로벌 유동성 위기 가능성." },
      ],
      tip:"DXY와 S&P500은 보통 역방향. 달러가 강해지면 미국 주식도 조정받는 경우가 많아요.",
    },
  },
  jpy: {
    label:"엔/달러(USD/JPY)", unit:"¥", color:"#e879f9",
    rawData: FX_HISTORY, field:"jpy",
    fmt: v => "¥"+v.toFixed(1),
    diffFmt: d => (d>0?"+":"")+d.toFixed(1)+"엔",
    interpret: v => v<130?"엔화 강세":v<145?"중립":v<155?"엔화 약세":"개입 경계",
    statusColor: v => v<130?"#34d399":v<145?"#fbbf24":v<155?"#fb923c":"#f87171",
    detail:{
      concept:"1달러에 몇 엔인지를 나타냅니다. 숫자가 오르면 엔화 약세입니다. 미·일 금리차와 거의 1:1로 움직이며, 엔캐리 트레이드와 연결됩니다.",
      levels:[
        { range:"~130엔", color:"#34d399", label:"엔화 강세", desc:"일본 수출기업 부담. 엔캐리 청산 위험." },
        { range:"130~145엔",color:"#fbbf24",label:"중립",     desc:"비교적 안정적인 범위." },
        { range:"145~155엔",color:"#fb923c",label:"엔화 약세",desc:"일본 당국 구두 경고 시작." },
        { range:"155엔+", color:"#f87171", label:"개입 경계", desc:"2022~24년 일본 당국 실제 개입 수준. 급변동 주의." },
      ],
      tip:"엔캐리 청산(엔화 급등)은 글로벌 위험자산 동반 하락을 유발합니다. 2024년 8월 폭락이 대표 사례.",
    },
  },
  eur: {
    label:"유로/달러(EUR/USD)", unit:"$", color:"#4ade80",
    rawData: FX_HISTORY, field:"eur",
    fmt: v => "$"+v.toFixed(3),
    diffFmt: d => (d>0?"+":"")+d.toFixed(3),
    interpret: v => v>1.15?"유로 강세":v>1.08?"중립":v>1.02?"유로 약세":"패리티 근처",
    statusColor: v => v>1.15?"#34d399":v>1.08?"#fbbf24":v>1.02?"#fb923c":"#f87171",
    detail:{
      concept:"1유로가 몇 달러인지 나타냅니다. 숫자가 오르면 유로 강세 = 달러 약세. 달러인덱스(DXY)의 약 58%를 차지해 DXY와 거의 반대로 움직입니다.",
      levels:[
        { range:"1.15+",   color:"#34d399", label:"유로 강세", desc:"달러 약세. 위험자산에 우호적 환경." },
        { range:"1.08~1.15",color:"#fbbf24",label:"중립",      desc:"정상 범위." },
        { range:"1.02~1.08",color:"#fb923c",label:"유로 약세", desc:"달러 강세. 신흥국 부담." },
        { range:"~1.02",   color:"#f87171", label:"패리티 근처",desc:"2022년 수준. 유럽 경기 위기 신호." },
      ],
      tip:"EUR/USD는 DXY와 거의 거울 관계. 유럽 경기와 ECB 금리 결정이 핵심 변수.",
    },
  },
  fed_assets: {
    label:"연준 총자산", unit:"B$", color:"#34d399",
    rawData: LIQUIDITY_HISTORY, field:"total",
    fmt: v => "$"+(v/1000).toFixed(2)+"조",
    diffFmt: d => (d>0?"+":"")+d.toFixed(0)+"B",
    interpret: v => v>9000?"대규모 완화":v>7500?"완화 유지":v>6500?"QT 진행":"QT 심화",
    statusColor: v => v>9000?"#34d399":v>7500?"#fbbf24":v>6500?"#fb923c":"#f87171",
    detail:{
      concept:"연준이 보유한 자산 총액. 양적완화(QE)로 늘어나고 양적긴축(QT)으로 줄어듭니다. 시중 유동성의 원천입니다.",
      levels:[
        { range:"$9조+",    color:"#34d399", label:"대규모 완화", desc:"코로나 대응 수준. 유동성 과잉." },
        { range:"$7.5~9조", color:"#fbbf24", label:"완화 유지",  desc:"양적완화 여진. 시중 자금 풍부." },
        { range:"$6~7.5조", color:"#fb923c", label:"QT 진행",    desc:"현재 구간. 유동성 서서히 줄어드는 중." },
        { range:"~$6조",    color:"#f87171", label:"QT 심화",    desc:"지준 부족 위험. 2019년 레포 발작 참고." },
      ],
      tip:"총자산이 줄어도 역레포 잔액이 먼저 줄고, 그게 소진되면 지준(은행 현금)이 줄기 시작합니다.",
    },
  },
  reserves: {
    label:"지급준비금", unit:"B$", color:"#22d3ee",
    rawData: LIQUIDITY_HISTORY, field:"reserves",
    fmt: v => "$"+(v/1000).toFixed(2)+"조",
    diffFmt: d => (d>0?"+":"")+d.toFixed(0)+"B",
    interpret: v => v>4000?"풍부":v>3000?"충분":v>2500?"주의":"위험",
    statusColor: v => v>4000?"#34d399":v>3000?"#fbbf24":v>2500?"#fb923c":"#f87171",
    detail:{
      concept:"은행들이 연준에 예치한 지급준비금. 은행 간 결제의 원천이자 시중 유동성의 실질적 온도계입니다.",
      levels:[
        { range:"$4조+",    color:"#34d399", label:"풍부", desc:"은행 유동성 넉넉. 금융시장 안정." },
        { range:"$3~4조",   color:"#fbbf24", label:"충분", desc:"적정 수준. '충분한 지준' 상태." },
        { range:"$2.5~3조", color:"#fb923c", label:"주의", desc:"QT 한계 근접. 레포시장 압박 가능성." },
        { range:"~$2.5조",  color:"#f87171", label:"위험", desc:"2019년 발작 수준. 연준 QT 중단 가능성." },
      ],
      tip:"지준이 $2.5조 아래로 떨어지면 연준이 QT를 멈추거나 역레포 금리를 조정할 가능성이 높아집니다.",
    },
  },
  rrp: {
    label:"역레포(ON RRP) 잔액", unit:"B$", color:"#fbbf24",
    rawData: LIQUIDITY_HISTORY, field:"rrp",
    fmt: v => "$"+v.toFixed(0)+"B",
    diffFmt: d => (d>0?"+":"")+d.toFixed(0)+"B",
    interpret: v => v>1000?"완충 풍부":v>500?"완충 있음":v>100?"거의 소진":"완전 소진",
    statusColor: v => v>1000?"#34d399":v>500?"#fbbf24":v>100?"#fb923c":"#f87171",
    detail:{
      concept:"MMF(머니마켓펀드) 등이 연준에 단기로 자금을 맡기는 창구. QT의 충격 완충재 역할을 합니다. 잔액이 소진되면 QT의 영향이 지준으로 직접 전달됩니다.",
      levels:[
        { range:"$1조+",    color:"#34d399", label:"완충 충분", desc:"QT가 진행돼도 지준엔 여유. 안심." },
        { range:"$500B~1조",color:"#fbbf24", label:"완충 감소", desc:"완충 여력 줄어들기 시작." },
        { range:"$100~500B",color:"#fb923c", label:"거의 소진", desc:"현재 구간. QT 충격이 지준으로 전이 시작." },
        { range:"~$100B",   color:"#f87171", label:"완전 소진", desc:"지준이 직접 줄어드는 단계. QT 한계 임박." },
      ],
      tip:"2022년 $2.5조까지 쌓였던 역레포가 2025년 거의 소진됐습니다. 이제 지준 방어가 핵심 관전 포인트.",
    },
  },
  tga: {
    label:"TGA(재무부 계정)", unit:"B$", color:"#f87171",
    rawData: LIQUIDITY_HISTORY, field:"tga",
    fmt: v => "$"+v.toFixed(0)+"B",
    diffFmt: d => (d>0?"+":"")+d.toFixed(0)+"B",
    interpret: v => v<200?"고갈 위험":v<600?"정상":v<900?"높은 수준":"과도한 적립",
    statusColor: v => v<200?"#f87171":v<600?"#34d399":v<900?"#fbbf24":"#fb923c",
    detail:{
      concept:"미국 재무부가 연준에 보유하는 당좌계좌. 정부가 국채 발행으로 TGA를 채우면 시중 유동성이 줄고, 지출로 TGA가 빠지면 유동성이 풀립니다.",
      levels:[
        { range:"~$200B",  color:"#f87171", label:"고갈 위험",   desc:"정부 디폴트·부채한도 협상 위기 신호." },
        { range:"$200~600B",color:"#34d399",label:"정상",        desc:"정상 운영 범위." },
        { range:"$600B~1조",color:"#fbbf24",label:"높은 수준",   desc:"국채 대량 발행 후 적립. 시중 유동성 흡수 효과." },
        { range:"$1조+",   color:"#fb923c", label:"과도한 적립", desc:"2023년 부채한도 해제 직후 수준. 시중 자금 급감." },
      ],
      tip:"TGA↑(적립)은 시중에서 돈을 빨아들이는 긴축 효과, TGA↓(지출)는 돈을 푸는 완화 효과. 지준과 시소 관계!",
    },
  },
  vix: {
    label:"VIX (공포지수)", unit:"", color:"#f43f5e",
    rawData: MARKET_HISTORY, field:"vix",
    fmt: v => v.toFixed(1),
    diffFmt: d => (d>0?"+":"")+d.toFixed(1),
    interpret: v => v<15?"시장 낙관":v<20?"정상":v<30?"불안":v<40?"공포":"극단적 공포",
    statusColor: v => v<15?"#34d399":v<20?"#fbbf24":v<30?"#fb923c":v<40?"#f87171":"#dc2626",
    detail:{
      concept:"S&P500 옵션 가격으로 계산하는 '향후 30일 예상 변동성'. 투자자들이 얼마나 불안해하는지를 수치로 보여줍니다.",
      levels:[
        { range:"~15",   color:"#34d399", label:"낙관",       desc:"시장이 너무 안심한 상태. 역설적으로 조정 위험 상존." },
        { range:"15~20", color:"#fbbf24", label:"정상",       desc:"건강한 시장. 투자하기 좋은 환경." },
        { range:"20~30", color:"#fb923c", label:"불안",       desc:"변동성 상승 중. 헤지 비용 증가." },
        { range:"30~40", color:"#f87171", label:"공포",       desc:"큰 이벤트 발생 구간. 과거 매수 기회가 되기도." },
        { range:"40+",   color:"#dc2626", label:"극단적 공포",desc:"2008·2020년 수준. 패닉 셀. 장기 관점 매수 고려." },
      ],
      tip:"VIX가 급등할 때가 역설적으로 장기 투자 기회였던 경우가 많습니다. VIX 80+ = 코로나, 45+ = 금융위기 수준.",
    },
  },
  gold: {
    label:"금(Gold)", unit:"$/oz", color:"#fcd34d",
    rawData: COMMODITY_HISTORY, field:"gold",
    fmt: v => "$"+v.toLocaleString(),
    diffFmt: d => (d>0?"+":"")+"$"+Math.round(d),
    interpret: v => v<1800?"저평가":v<2400?"중립~상승":v<3000?"고가":"역사적 고점",
    statusColor: v => v<1800?"#34d399":v<2400?"#fbbf24":v<3000?"#fb923c":"#f87171",
    detail:{
      concept:"대표적인 안전자산이자 인플레이션 헤지 수단. 달러 약세·실질금리 하락 시 강세를 보이며, 지정학 위기 때 급등합니다.",
      levels:[
        { range:"~$1,800",     color:"#34d399", label:"저평가",     desc:"실질금리 상승 또는 위험 선호 환경." },
        { range:"$1,800~2,400",color:"#fbbf24", label:"중립",       desc:"2020~2023년 대체적 범위. 정상 가격대." },
        { range:"$2,400~3,000",color:"#fb923c", label:"고가",       desc:"달러 약세·인플레 우려 반영. 추격 매수 주의." },
        { range:"$3,000+",     color:"#f87171", label:"역사적 고점",desc:"2025년 달성. 과매수 구간, 변동성 확대 주의." },
      ],
      tip:"금과 실질금리(10년물-인플레)는 역방향. 실질금리가 내리면 금이 오릅니다.",
    },
  },
  silver: {
    label:"은(Silver)", unit:"$/oz", color:"#cbd5e1",
    rawData: COMMODITY_HISTORY, field:"silver",
    fmt: v => "$"+v.toFixed(2),
    diffFmt: d => (d>0?"+":"")+"$"+d.toFixed(2),
    interpret: v => v<20?"저가":v<30?"정상":v<40?"고가":"역사적 고점",
    statusColor: v => v<20?"#34d399":v<30?"#fbbf24":v<40?"#fb923c":"#f87171",
    detail:{
      concept:"금의 성격(안전자산·인플레 헤지)과 산업금속(태양광, 전기차, 반도체 제조)의 성격을 동시에 가진 이중적 금속.",
      levels:[
        { range:"~$20",  color:"#34d399", label:"저가",       desc:"역사적 저점 수준. 금 대비 저평가." },
        { range:"$20~30",color:"#fbbf24", label:"정상",       desc:"일반적 거래 범위." },
        { range:"$30~40",color:"#fb923c", label:"고가",       desc:"산업 수요 강세 또는 위험자산 선호 환경." },
        { range:"$40+",  color:"#f87171", label:"역사적 고점",desc:"2011년 $50 수준 접근. 과열 주의." },
      ],
      tip:"금/은 비율(Gold-Silver Ratio)이 80 이상이면 은이 상대적으로 저평가된 신호입니다.",
    },
  },
  copper: {
    label:"구리(Copper)", unit:"$/lb", color:"#fb923c",
    rawData: COMMODITY_HISTORY, field:"copper",
    fmt: v => "$"+v.toFixed(2)+"/lb",
    diffFmt: d => (d>0?"+":"")+"$"+d.toFixed(2),
    interpret: v => v<3.5?"경기 우려":v<4.5?"정상":v<5.5?"경기 과열":"공급 부족",
    statusColor: v => v<3.5?"#f87171":v<4.5?"#34d399":v<5.5?"#fbbf24":"#f87171",
    detail:{
      concept:"'닥터 코퍼(Dr. Copper)' — 경기 선행지표로 유명. 전기차·전력 인프라·건설 등 산업 전반에 쓰여 실물 경기를 가장 잘 반영하는 원자재.",
      levels:[
        { range:"~$3.5",  color:"#f87171", label:"경기 우려", desc:"수요 감소 신호. 경기침체 전조일 수 있음." },
        { range:"$3.5~4.5",color:"#34d399",label:"정상",      desc:"건강한 글로벌 경기를 반영하는 수준." },
        { range:"$4.5~5.5",color:"#fbbf24",label:"경기 과열",desc:"강한 수요 또는 공급 부족 신호." },
        { range:"$5.5+",  color:"#f87171", label:"공급 부족", desc:"구조적 공급 부족. 에너지 전환 수요가 주 원인." },
      ],
      tip:"구리가 오르면 경기 확장 기대→산업재·소재주 유리. 구리가 내리면 경기 둔화 신호.",
    },
  },
  wti: {
    label:"WTI 원유", unit:"$/bbl", color:"#84cc16",
    rawData: COMMODITY_HISTORY, field:"wti",
    fmt: v => "$"+v.toFixed(1)+"/bbl",
    diffFmt: d => (d>0?"+":"")+"$"+d.toFixed(1),
    interpret: v => v<50?"저유가·경기 우려":v<80?"정상":v<100?"고유가 부담":"초고유가",
    statusColor: v => v<50?"#f87171":v<80?"#34d399":v<100?"#fbbf24":"#f87171",
    detail:{
      concept:"미국 대표 원유 선물 가격. 에너지 비용을 통해 물가 전반에 영향을 주고, 산유국 경제와 항공·운송·화학 산업에 직접 연결됩니다.",
      levels:[
        { range:"~$50",   color:"#f87171", label:"저유가",   desc:"수요 감소(경기침체) 또는 공급 과잉 신호." },
        { range:"$50~80", color:"#34d399", label:"정상",     desc:"소비자·기업 모두에게 부담이 적은 적정 구간." },
        { range:"$80~100",color:"#fbbf24", label:"고유가",   desc:"인플레 압력. 교통·제조업 비용 상승." },
        { range:"$100+",  color:"#f87171", label:"초고유가", desc:"2022년 수준. 에너지 위기. 전반적 물가 급등." },
      ],
      tip:"WTI가 오르면 인플레 기대→연준 긴축 지속→주식에 부정적. 단, 에너지주는 상승.",
    },
  },
  bitcoin: {
    label:"비트코인(BTC)", unit:"$", color:"#f59e0b",
    rawData: COMMODITY_HISTORY, field:"btc",
    fmt: v => "$"+Math.round(v).toLocaleString(),
    diffFmt: d => (d>0?"+":"")+"$"+Math.round(d).toLocaleString(),
    interpret: v => v<30000?"약세장":v<60000?"회복":v<100000?"강세장":"과열 구간",
    statusColor: v => v<30000?"#f87171":v<60000?"#fbbf24":v<100000?"#34d399":"#a78bfa",
    detail:{
      concept:"디지털 희소 자산이자 '위험자산 중의 위험자산'. 4년마다 반감기가 있으며, 매크로 유동성(M2·연준 자산)과 높은 상관관계를 보입니다.",
      levels:[
        { range:"~$30,000",     color:"#f87171", label:"약세장",    desc:"2022년 하락 수준. 공포 구간." },
        { range:"$30,000~60,000",color:"#fbbf24",label:"회복",      desc:"전 고점 탈환 전 과도기." },
        { range:"$60,000~100,000",color:"#34d399",label:"강세장",   desc:"2024~25년 반감기 사이클 강세 구간." },
        { range:"$100,000+",    color:"#a78bfa", label:"과열·신고점",desc:"2025년 달성. 변동성 극대화. 리스크 관리 필수." },
      ],
      tip:"BTC는 연준 총자산(M2)과 약 6~12개월 선행하는 관계가 관찰됩니다. 유동성이 풀릴 때 가장 먼저 반응하는 자산.",
    },
  },
};

// ── 전월 대비 변화량 시계열 미리 계산 ──
const RESERVES_DELTA_HISTORY = LIQUIDITY_HISTORY.slice(1).map((d, i) => ({
  date: d.date,
  value: Math.round(d.reserves - LIQUIDITY_HISTORY[i].reserves),
}));
const TGA_DELTA_HISTORY = LIQUIDITY_HISTORY.slice(1).map((d, i) => ({
  date: d.date,
  value: Math.round(d.tga - LIQUIDITY_HISTORY[i].tga),
}));

// ── 변화량 지표 별도 정의 ──
const DELTA_INDICATORS = {
  reserves_delta: {
    label:"지급준비금 변화량", unit:"ΔB$", color:"#22d3ee",
    rawData: RESERVES_DELTA_HISTORY, field:"value",
    fmt: v => (v>=0?"+":"")+v.toFixed(0)+"B",
    diffFmt: d => (d>=0?"+":"")+d.toFixed(0)+"B",
    isDelta: true,
    interpret: v => v>100?"큰 폭 증가":v>30?"증가":v>-30?"보합":v>-100?"감소":"큰 폭 감소",
    statusColor: v => v>100?"#34d399":v>30?"#4ade80":v>-30?"#fbbf24":v>-100?"#fb923c":"#f87171",
    detail:{
      concept:"지급준비금의 전기 대비 증감액(십억 달러). 잔액 수준이 아니라 '속도'를 보는 지표입니다. 얼마나 빠르게 지준이 늘거나 줄고 있는지 확인할 수 있습니다.",
      levels:[
        { range:"+$100B+",    color:"#34d399", label:"큰 폭 증가", desc:"유동성 빠르게 확대. QT 중단·레포 공급 신호." },
        { range:"+$30~100B",  color:"#4ade80", label:"증가",       desc:"완만한 유동성 확대." },
        { range:"-$30~+$30B", color:"#fbbf24", label:"보합",       desc:"큰 변동 없음." },
        { range:"-$100~-$30B",color:"#fb923c", label:"감소",       desc:"유동성 축소. QT 효과 진행 중." },
        { range:"-$100B 이하",color:"#f87171", label:"큰 폭 감소", desc:"빠른 유동성 소진. QT 가속 또는 세금 납부 시즌." },
      ],
      tip:"TGA 변화량과 반대 방향이면 시소 관계가 작동 중. 지준 감소 + TGA 증가가 동시이면 강한 긴축 신호입니다.",
    },
  },
  tga_delta: {
    label:"TGA 변화량", unit:"ΔB$", color:"#f87171",
    rawData: TGA_DELTA_HISTORY, field:"value",
    fmt: v => (v>=0?"+":"")+v.toFixed(0)+"B",
    diffFmt: d => (d>=0?"+":"")+d.toFixed(0)+"B",
    isDelta: true,
    interpret: v => v>100?"강한 흡수(긴축)":v>30?"흡수":v>-30?"보합":v>-100?"방출":"강한 방출(완화)",
    statusColor: v => v>100?"#f87171":v>30?"#fb923c":v>-30?"#fbbf24":v>-100?"#4ade80":"#34d399",
    detail:{
      concept:"TGA의 전기 대비 증감액. TGA가 늘면(+) 시중 유동성을 흡수하는 긴축 효과, 줄면(-) 유동성을 공급하는 완화 효과입니다.",
      levels:[
        { range:"+$100B+",    color:"#f87171", label:"강한 흡수",   desc:"대규모 국채 발행 후 적립. 시중 현금 급감." },
        { range:"+$30~100B",  color:"#fb923c", label:"흡수",        desc:"TGA 증가로 완만한 긴축 효과." },
        { range:"-$30~+$30B", color:"#fbbf24", label:"보합",        desc:"큰 변동 없음." },
        { range:"-$100~-$30B",color:"#4ade80", label:"방출",        desc:"정부 지출 확대. 시중 유동성 공급." },
        { range:"-$100B 이하",color:"#34d399", label:"강한 방출",   desc:"대규모 정부 지출. 유동성 급증 효과." },
      ],
      tip:"부채한도 협상 타결 직후엔 TGA가 빠르게 채워지면서(+) 시중 유동성이 급격히 줄어드는 패턴이 반복됩니다.",
    },
  },
};

/* ═══════════════════ 탭 정의 ═══════════════════ */
const TABS = [
  { key:"rates",       label:"금리",       icon:"📈", color:"#60a5fa",
    keys:["kr_us_rate","rate_spread","us_triple_yield","term_spread"] },
  { key:"fx",          label:"환율·유동성", icon:"💱", color:"#fbbf24",
    keys:["usdkrw","dxy","jpy","eur","fed_assets","reserves","rrp","tga","liquidity_delta"] },
  { key:"market",      label:"시장",       icon:"📊", color:"#f43f5e",
    keys:["vix","ai_market"] },
  { key:"commodities", label:"원자재",     icon:"🛢️", color:"#84cc16",
    keys:["gold","silver","copper","wti","bitcoin"] },
];

const PERIOD_YEARS = { "1Y":1, "3Y":3, "5Y":5 };

/* ═══════════════════ 기준금리 발표 일정 ═══════════════════ */
// 날짜가 지나면 자동으로 다음 일정을 보여줌
const BOK_SCHEDULE = [
  "2026-07-16","2026-08-27","2026-10-16","2026-11-27",
  "2027-01-15","2027-02-26","2027-04-15","2027-05-27",
  "2027-07-15","2027-08-26","2027-10-14","2027-11-25",
];
const FOMC_SCHEDULE = [
  "2026-06-18","2026-07-30","2026-09-17","2026-10-29","2026-12-10",
  "2027-01-28","2027-03-18","2027-04-29","2027-06-17","2027-07-29",
  "2027-09-16","2027-10-28","2027-12-09",
];

function getNextDate(schedules) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = schedules
    .map(d => new Date(d))
    .filter(d => d >= today)
    .sort((a, b) => a - b);
  return future[0] || null;
}

function daysUntil(date) {
  if (!date) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((date - today) / 86400000);
}

function formatKo(date) {
  if (!date) return "—";
  return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`;
}

/* ═══════════════════ 상세보기 모달 ═══════════════════ */
function DetailModal({ indKey, onClose }) {
  const meta = INDICATORS[indKey];
  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)",
        backdropFilter:"blur(5px)", zIndex:1000,
        display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:20, width:"100%", maxWidth:500,
          maxHeight:"85vh", overflow:"auto" }}
      >
        {/* 모달 헤더 */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)",
          position:"sticky", top:0, background:"#0f172a" }}>
          <span style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>
            📖 {meta.label} — 상세 가이드
          </span>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:8, color:"#94a3b8", fontSize:14, cursor:"pointer", padding:"4px 10px" }}>
            ✕
          </button>
        </div>

        <div style={{ padding:"16px 20px 24px" }}>
          {/* 개념 */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569",
              textTransform:"uppercase", marginBottom:8 }}>💡 개념</div>
            <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.75, margin:0 }}>
              {meta.detail.concept}
            </p>
          </div>

          {/* 수치 기준 */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569",
              textTransform:"uppercase", marginBottom:8 }}>📏 수치 기준</div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {meta.detail.levels.map((lv, i) => (
                <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start",
                  background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px",
                  borderLeft:"3px solid "+lv.color }}>
                  <div style={{ minWidth:90, flexShrink:0 }}>
                    <div style={{ fontSize:10.5, color:lv.color, fontWeight:700, marginBottom:3 }}>
                      {lv.range}
                    </div>
                    <span style={{ fontSize:10, color:lv.color,
                      background:lv.color+"22", padding:"1px 6px", borderRadius:99 }}>
                      {lv.label}
                    </span>
                  </div>
                  <span style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{lv.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 투자 팁 */}
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569",
              textTransform:"uppercase", marginBottom:8 }}>🔗 투자 팁</div>
            <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
              borderRadius:10, padding:"12px 14px", fontSize:12.5, color:"#c7d2fe", lineHeight:1.7 }}>
              {meta.detail.tip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ 한·미 기준금리 통합 카드 ═══════════════════ */
function DualRateCard() {
  const [period, setPeriod] = useState("1Y");
  const [showDetail, setShowDetail] = useState(null); // "kr" | "us" | null

  const raw = RATE_HISTORY;
  const last = raw[raw.length - 1];
  const prev = raw[raw.length - 2];

  const years = PERIOD_YEARS[period];
  const chartData = filterByYears(raw, years).map(d => ({
    date: d.date, "한국": d.kr, "미국": d.us,
  }));

  const krDiff = last.kr - prev.kr;
  const usDiff = last.us - prev.us;

  // 상세보기 메타 임시 선택
  const detailMeta = showDetail === "kr" ? INDICATORS.kr_rate : INDICATORS.us_rate;

  return (
    <>
      {showDetail && (
        <div onClick={() => setShowDetail(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)",
            backdropFilter:"blur(5px)", zIndex:1000,
            display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20, width:"100%", maxWidth:500, maxHeight:"85vh", overflow:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)",
              position:"sticky", top:0, background:"#0f172a" }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>
                📖 {detailMeta.label} — 상세 가이드
              </span>
              <button onClick={() => setShowDetail(null)}
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:8, color:"#94a3b8", fontSize:14, cursor:"pointer", padding:"4px 10px" }}>✕</button>
            </div>
            <div style={{ padding:"16px 20px 24px" }}>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>💡 개념</div>
                <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.75, margin:0 }}>{detailMeta.detail.concept}</p>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>📏 수치 기준</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {detailMeta.detail.levels.map((lv, i) => (
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start",
                      background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px",
                      borderLeft:"3px solid "+lv.color }}>
                      <div style={{ minWidth:90, flexShrink:0 }}>
                        <div style={{ fontSize:10.5, color:lv.color, fontWeight:700, marginBottom:3 }}>{lv.range}</div>
                        <span style={{ fontSize:10, color:lv.color, background:lv.color+"22", padding:"1px 6px", borderRadius:99 }}>{lv.label}</span>
                      </div>
                      <span style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{lv.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>🔗 투자 팁</div>
                <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
                  borderRadius:10, padding:"12px 14px", fontSize:12.5, color:"#c7d2fe", lineHeight:1.7 }}>
                  {detailMeta.detail.tip}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"18px 18px 14px", display:"flex", flexDirection:"column", gap:10 }}>

        {/* 타이틀 */}
        <div style={{ fontSize:11.5, color:"#64748b", letterSpacing:"0.04em" }}>
          🇰🇷 한국 · 🇺🇸 미국 기준금리 비교
        </div>

        {/* ── 다음 발표일 배너 ── */}
        {(() => {
          const bokNext  = getNextDate(BOK_SCHEDULE);
          const fomcNext = getNextDate(FOMC_SCHEDULE);
          const bokDays  = daysUntil(bokNext);
          const fomcDays = daysUntil(fomcNext);
          const urgentColor = d => d <= 7 ? "#f87171" : d <= 30 ? "#fbbf24" : "#34d399";
          return (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { flag:"🇰🇷", label:"한국은행 금통위", date:bokNext, days:bokDays, accent:"#f87171" },
                { flag:"🇺🇸", label:"FOMC",          date:fomcNext, days:fomcDays, accent:"#60a5fa" },
              ].map(({ flag, label, date, days, accent }) => {
                const dc = urgentColor(days);
                return (
                  <div key={label} style={{
                    display:"flex", alignItems:"center", gap:10,
                    background:"rgba(255,255,255,0.025)",
                    border:"1px solid "+accent+"33",
                    borderLeft:"3px solid "+accent,
                    borderRadius:10, padding:"10px 14px",
                    minWidth:0,
                  }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{flag}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:9.5, color:"#64748b", marginBottom:2 }}>
                        다음 {label}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>
                        {formatKo(date)}
                      </div>
                    </div>
                    <div style={{
                      fontSize:14, fontWeight:800, color:dc,
                      background:dc+"18", border:"1px solid "+dc+"44",
                      borderRadius:8, padding:"4px 12px", whiteSpace:"nowrap", flexShrink:0,
                    }}>
                      {days === 0 ? "오늘!" : `D-${days}`}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* 현재값 2개 나란히 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {/* 한국 */}
          <div style={{ background:"rgba(248,113,113,0.06)", borderRadius:12, padding:"12px 14px",
            border:"1px solid rgba(248,113,113,0.15)" }}>
            <div style={{ fontSize:10, color:"#f87171", marginBottom:4 }}>🇰🇷 한국 기준금리</div>
            <div style={{ fontSize:26, fontWeight:800, color:"#f87171", letterSpacing:-0.5 }}>
              {last.kr.toFixed(2)}%
            </div>
            <div style={{ fontSize:10.5, color: krDiff===0?"#475569":krDiff>0?"#4ade80":"#f87171", marginTop:4 }}>
              {krDiff===0?"변동없음":krDiff>0?"▲ +":"▼ "}{krDiff!==0&&Math.abs(krDiff).toFixed(2)+"%p 전월비"}
            </div>
            <button onClick={() => setShowDetail("kr")}
              style={{ marginTop:8, fontSize:10, padding:"3px 10px", borderRadius:6, cursor:"pointer",
                background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)",
                color:"#f87171" }}>📖 상세보기</button>
          </div>

          {/* 미국 */}
          <div style={{ background:"rgba(96,165,250,0.06)", borderRadius:12, padding:"12px 14px",
            border:"1px solid rgba(96,165,250,0.15)" }}>
            <div style={{ fontSize:10, color:"#60a5fa", marginBottom:4 }}>🇺🇸 미국 기준금리</div>
            <div style={{ fontSize:26, fontWeight:800, color:"#60a5fa", letterSpacing:-0.5 }}>
              {last.us.toFixed(2)}%
            </div>
            <div style={{ fontSize:10.5, color: usDiff===0?"#475569":usDiff>0?"#4ade80":"#f87171", marginTop:4 }}>
              {usDiff===0?"변동없음":usDiff>0?"▲ +":"▼ "}{usDiff!==0&&Math.abs(usDiff).toFixed(2)+"%p 전월비"}
            </div>
            <button onClick={() => setShowDetail("us")}
              style={{ marginTop:8, fontSize:10, padding:"3px 10px", borderRadius:6, cursor:"pointer",
                background:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.2)",
                color:"#60a5fa" }}>📖 상세보기</button>
          </div>
        </div>

        {/* 기간 토글 */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#334155" }}>추이 (최근 {period})</span>
          <div style={{ display:"flex", gap:3 }}>
            {["1Y","3Y","5Y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ fontSize:10.5, padding:"2px 9px", borderRadius:6, cursor:"pointer",
                  border:"none",
                  background: period===p ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.04)",
                  color: period===p ? "#60a5fa" : "#475569",
                  outline: period===p ? "1px solid rgba(96,165,250,0.4)" : "none" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 이중 라인 차트 */}
        <div style={{ height:160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top:4, right:12, bottom:4, left:0 }}>
              <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} interval="preserveStartEnd"
                tickFormatter={v => v.slice(0,7)} minTickGap={40} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} tickFormatter={v => v.toFixed(1)+"%"}
                width={42} tickCount={4} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, fontSize:11 }}
                labelStyle={{ color:"#64748b" }}
                formatter={(v, name) => [v.toFixed(2)+"%", name]}
              />
              <Line type="stepAfter" dataKey="한국" stroke="#f87171" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="stepAfter" dataKey="미국" stroke="#60a5fa" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 */}
        <div style={{ display:"flex", gap:14, justifyContent:"center" }}>
          <span style={{ fontSize:10.5, color:"#f87171", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:16, height:2, background:"#f87171", display:"inline-block", borderRadius:2 }} />
            🇰🇷 한국
          </span>
          <span style={{ fontSize:10.5, color:"#60a5fa", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:16, height:2, background:"#60a5fa", display:"inline-block", borderRadius:2 }} />
            🇺🇸 미국
          </span>
        </div>

        <div style={{ fontSize:9.5, color:"#1e3a5f" }}>
          최신: {chartData[chartData.length - 1]?.date}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ 금리차 카드 ═══════════════════ */
function SpreadCard() {
  const meta = INDICATORS.rate_spread;
  const [period, setPeriod] = useState("1Y");
  const [showDetail, setShowDetail] = useState(false);

  const raw = RATE_HISTORY;
  const last = raw[raw.length - 1];
  const prev = raw[raw.length - 2];
  const curVal  = meta.compute(last);
  const prevVal = meta.compute(prev);
  const diff    = curVal - prevVal;
  const statusColor = meta.statusColor(curVal);

  const years = PERIOD_YEARS[period];
  const chartData = filterByYears(raw, years).map(d => ({
    date: d.date, value: meta.compute(d),
  }));

  return (
    <>
      {showDetail && <DetailModal indKey="rate_spread" onClose={() => setShowDetail(false)} />}

      <div style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"18px 18px 14px", display:"flex", flexDirection:"column", gap:10 }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <span style={{ fontSize:11.5, color:"#64748b", letterSpacing:"0.04em" }}>
            {meta.label} <span style={{ fontSize:10, color:"#334155" }}>(KR − US)</span>
          </span>
          <span style={{ fontSize:10.5, fontWeight:700, color:statusColor,
            background:statusColor+"22", padding:"2px 9px", borderRadius:99,
            border:"1px solid "+statusColor+"44" }}>
            {meta.interpret(curVal)}
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
          <span style={{ fontSize:28, fontWeight:800, color:meta.color, letterSpacing:-0.5 }}>
            {meta.fmt(curVal)}
          </span>
          <span style={{ fontSize:11, color: diff>0?"#4ade80":"#f87171" }}>
            {diff>0?"▲":"▼"} {meta.diffFmt(Math.abs(diff))}
            <span style={{ color:"#334155", marginLeft:3 }}>전월비</span>
          </span>
        </div>

        <div style={{ fontSize:11.5, color:"#94a3b8", lineHeight:1.6,
          padding:"7px 10px", background:"rgba(255,255,255,0.025)", borderRadius:7,
          borderLeft:"2px solid "+statusColor }}>
          {curVal < 0
            ? `미국이 ${Math.abs(curVal).toFixed(2)}%p 더 높은 상태 — 원화 약세·자본유출 압력`
            : `한국이 ${curVal.toFixed(2)}%p 더 높은 상태 — 원화 환율에 우호적`}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#334155" }}>추이 (최근 {period})</span>
          <div style={{ display:"flex", gap:3 }}>
            {["1Y","3Y","5Y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ fontSize:10.5, padding:"2px 9px", borderRadius:6, cursor:"pointer",
                  border:"none",
                  background: period===p ? meta.color+"33" : "rgba(255,255,255,0.04)",
                  color: period===p ? meta.color : "#475569",
                  outline: period===p ? "1px solid "+meta.color+"66" : "none" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height:130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top:4, right:12, bottom:4, left:0 }}>
              <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} interval="preserveStartEnd"
                tickFormatter={v => v.slice(0,7)} minTickGap={40} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} tickFormatter={v => (v>0?"+":"")+v.toFixed(1)+"%"}
                width={46} tickCount={4} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, fontSize:11 }}
                labelStyle={{ color:"#64748b" }}
                formatter={v => [meta.fmt(v), "한·미 금리차"]}
              />
              {/* 0 기준선 */}
              <Line type="monotone" dataKey={() => 0} stroke="#334155" strokeWidth={1}
                strokeDasharray="4 3" dot={false} isAnimationActive={false} legendType="none" />
              <Line type="stepAfter" dataKey="value" stroke={meta.color} strokeWidth={2}
                dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:9.5, color:"#1e3a5f" }}>
            최신: {chartData[chartData.length - 1]?.date}
          </span>
          <button onClick={() => setShowDetail(true)}
            style={{ fontSize:11, padding:"4px 12px", borderRadius:8, cursor:"pointer",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              color:"#94a3b8" }}>
            📖 상세보기
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ 미국 국채 3종 통합 카드 ═══════════════════ */
function TripleYieldCard() {
  const [period, setPeriod] = useState("1Y");
  const [showDetail, setShowDetail] = useState(null); // "y2"|"y10"|"y30"|null

  const raw = RATE_HISTORY;
  const last = raw[raw.length - 1];
  const prev = raw[raw.length - 2];

  const yields = [
    { key:"y2",  label:"2년물",  color:"#38bdf8", meta: INDICATORS.us_2y  },
    { key:"y10", label:"10년물", color:"#f59e0b", meta: INDICATORS.us_10y },
    { key:"y30", label:"30년물", color:"#f87171", meta: INDICATORS.us_30y },
  ];

  const years = PERIOD_YEARS[period];
  const chartData = filterByYears(raw, years).map(d => ({
    date: d.date, "2년물": d.y2, "10년물": d.y10, "30년물": d.y30,
  }));

  const detailMeta = showDetail ? yields.find(y => y.key === showDetail)?.meta : null;

  return (
    <>
      {showDetail && detailMeta && (
        <div onClick={() => setShowDetail(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)",
            backdropFilter:"blur(5px)", zIndex:1000,
            display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20, width:"100%", maxWidth:500, maxHeight:"85vh", overflow:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)",
              position:"sticky", top:0, background:"#0f172a" }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>
                📖 미국 {detailMeta.label} — 상세 가이드
              </span>
              <button onClick={() => setShowDetail(null)}
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:8, color:"#94a3b8", fontSize:14, cursor:"pointer", padding:"4px 10px" }}>✕</button>
            </div>
            <div style={{ padding:"16px 20px 24px" }}>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>💡 개념</div>
                <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.75, margin:0 }}>{detailMeta.detail.concept}</p>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>📏 수치 기준</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {detailMeta.detail.levels.map((lv, i) => (
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start",
                      background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px",
                      borderLeft:"3px solid "+lv.color }}>
                      <div style={{ minWidth:90, flexShrink:0 }}>
                        <div style={{ fontSize:10.5, color:lv.color, fontWeight:700, marginBottom:3 }}>{lv.range}</div>
                        <span style={{ fontSize:10, color:lv.color, background:lv.color+"22", padding:"1px 6px", borderRadius:99 }}>{lv.label}</span>
                      </div>
                      <span style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{lv.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>🔗 투자 팁</div>
                <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
                  borderRadius:10, padding:"12px 14px", fontSize:12.5, color:"#c7d2fe", lineHeight:1.7 }}>
                  {detailMeta.detail.tip}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"18px 18px 14px", display:"flex", flexDirection:"column", gap:10 }}>

        {/* 타이틀 */}
        <div style={{ fontSize:11.5, color:"#64748b", letterSpacing:"0.04em" }}>
          🇺🇸 미국 국채 금리 (2년 · 10년 · 30년)
        </div>

        {/* 현재값 3개 나란히 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {yields.map(({ key, label, color, meta }) => {
            const cur = last[key];
            const dif = last[key] - prev[key];
            return (
              <div key={key} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12,
                padding:"10px 12px", border:"1px solid "+color+"22" }}>
                <div style={{ fontSize:9.5, color:color, marginBottom:3 }}>{label}</div>
                <div style={{ fontSize:20, fontWeight:800, color:color, letterSpacing:-0.5 }}>
                  {cur.toFixed(2)}%
                </div>
                <div style={{ fontSize:9.5, color: dif===0?"#475569":dif>0?"#4ade80":"#f87171", marginTop:3 }}>
                  {dif===0?"—":dif>0?"▲ +":"▼ "}{dif!==0&&Math.abs(dif).toFixed(2)+"%p"}
                </div>
                <div style={{ fontSize:9, color:meta.statusColor(cur),
                  background:meta.statusColor(cur)+"18", padding:"1px 6px", borderRadius:99,
                  display:"inline-block", marginTop:4 }}>
                  {meta.interpret(cur)}
                </div>
                <br/>
                <button onClick={() => setShowDetail(key)}
                  style={{ marginTop:5, fontSize:9.5, padding:"2px 8px", borderRadius:5, cursor:"pointer",
                    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                    color:"#64748b" }}>📖 상세</button>
              </div>
            );
          })}
        </div>

        {/* 기간 토글 */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#334155" }}>추이 (최근 {period})</span>
          <div style={{ display:"flex", gap:3 }}>
            {["1Y","3Y","5Y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ fontSize:10.5, padding:"2px 9px", borderRadius:6, cursor:"pointer",
                  border:"none",
                  background: period===p ? "rgba(192,132,252,0.2)" : "rgba(255,255,255,0.04)",
                  color: period===p ? "#c084fc" : "#475569",
                  outline: period===p ? "1px solid rgba(192,132,252,0.4)" : "none" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 3선 차트 */}
        <div style={{ height:160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top:4, right:12, bottom:4, left:0 }}>
              <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} interval="preserveStartEnd"
                tickFormatter={v => v.slice(0,7)} minTickGap={40} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} tickFormatter={v => v.toFixed(1)+"%"}
                width={42} tickCount={4} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, fontSize:11 }}
                labelStyle={{ color:"#64748b" }}
                formatter={(v, name) => [v.toFixed(2)+"%", name]}
              />
              <Line type="monotone" dataKey="2년물"  stroke="#38bdf8" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="10년물" stroke="#f59e0b" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="30년물" stroke="#f87171" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 */}
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          {[["2년물","#38bdf8"],["10년물","#f59e0b"],["30년물","#f87171"]].map(([l,c]) => (
            <span key={l} style={{ fontSize:10.5, color:c, display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:14, height:2, background:c, display:"inline-block", borderRadius:2 }} />
              {l}
            </span>
          ))}
        </div>

        <div style={{ fontSize:9.5, color:"#1e3a5f" }}>
          최신: {chartData[chartData.length - 1]?.date}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ 장단기 금리차 카드 ═══════════════════ */
function TermSpreadCard() {
  const meta = INDICATORS.term_spread;
  const [period, setPeriod] = useState("1Y");
  const [showDetail, setShowDetail] = useState(false);

  const raw = RATE_HISTORY;
  const last = raw[raw.length - 1];
  const prev = raw[raw.length - 2];
  const curVal  = meta.compute(last);
  const prevVal = meta.compute(prev);
  const diff    = curVal - prevVal;
  const statusColor = meta.statusColor(curVal);

  const years = PERIOD_YEARS[period];
  const chartData = filterByYears(raw, years).map(d => ({
    date: d.date, value: meta.compute(d),
  }));

  return (
    <>
      {showDetail && <DetailModal indKey="term_spread" onClose={() => setShowDetail(false)} />}

      <div style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"18px 18px 14px", display:"flex", flexDirection:"column", gap:10 }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <span style={{ fontSize:11.5, color:"#64748b", letterSpacing:"0.04em" }}>
            {meta.label} <span style={{ fontSize:10, color:"#334155" }}>(10Y − 2Y)</span>
          </span>
          <span style={{ fontSize:10.5, fontWeight:700, color:statusColor,
            background:statusColor+"22", padding:"2px 9px", borderRadius:99,
            border:"1px solid "+statusColor+"44" }}>
            {meta.interpret(curVal)}
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
          <span style={{ fontSize:28, fontWeight:800, color:meta.color, letterSpacing:-0.5 }}>
            {meta.fmt(curVal)}
          </span>
          <span style={{ fontSize:11, color: diff>0?"#4ade80":"#f87171" }}>
            {diff>0?"▲":"▼"} {meta.diffFmt(Math.abs(diff))}
            <span style={{ color:"#334155", marginLeft:3 }}>전월비</span>
          </span>
        </div>

        <div style={{ fontSize:11.5, color:"#94a3b8", lineHeight:1.6,
          padding:"7px 10px", background:"rgba(255,255,255,0.025)", borderRadius:7,
          borderLeft:"2px solid "+statusColor }}>
          {curVal < 0
            ? `역전 중 (${curVal.toFixed(2)}%p) — 단기가 장기보다 높은 이상 상태. 과거 경기침체 선행 신호`
            : `정상 우상향 (${curVal.toFixed(2)}%p) — 장기 금리가 단기보다 높은 건강한 상태`}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#334155" }}>추이 (최근 {period})</span>
          <div style={{ display:"flex", gap:3 }}>
            {["1Y","3Y","5Y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ fontSize:10.5, padding:"2px 9px", borderRadius:6, cursor:"pointer",
                  border:"none",
                  background: period===p ? meta.color+"33" : "rgba(255,255,255,0.04)",
                  color: period===p ? meta.color : "#475569",
                  outline: period===p ? "1px solid "+meta.color+"66" : "none" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height:130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top:4, right:12, bottom:4, left:0 }}>
              <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} interval="preserveStartEnd"
                tickFormatter={v => v.slice(0,7)} minTickGap={40} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} tickFormatter={v => (v>0?"+":"")+v.toFixed(1)+"%"}
                width={46} tickCount={4} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, fontSize:11 }}
                labelStyle={{ color:"#64748b" }}
                formatter={v => [meta.fmt(v), "장단기 금리차(10Y-2Y)"]}
              />
              <Line type="monotone" dataKey={() => 0} stroke="#475569" strokeWidth={1}
                strokeDasharray="4 3" dot={false} isAnimationActive={false} legendType="none" />
              <Line type="monotone" dataKey="value" stroke={meta.color} strokeWidth={2}
                dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 역전/정상 안내 */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:10, color:"#34d399", background:"rgba(52,211,153,0.08)",
            border:"1px solid rgba(52,211,153,0.2)", padding:"2px 8px", borderRadius:6 }}>
            ▲ 양(+): 정상 — 경기 확장 기대
          </span>
          <span style={{ fontSize:10, color:"#f87171", background:"rgba(248,113,113,0.08)",
            border:"1px solid rgba(248,113,113,0.2)", padding:"2px 8px", borderRadius:6 }}>
            ▼ 음(−): 역전 — 침체 선행 신호
          </span>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:9.5, color:"#1e3a5f" }}>
            최신: {chartData[chartData.length - 1]?.date}
          </span>
          <button onClick={() => setShowDetail(true)}
            style={{ fontSize:11, padding:"4px 12px", borderRadius:8, cursor:"pointer",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              color:"#94a3b8" }}>
            📖 상세보기
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ Claude AI 시장 지표 카드 ═══════════════════ */
const AI_METRICS = [
  {
    key:"fear_greed", label:"공포탐욕지수", icon:"😰",
    color:"#f59e0b", unit:"0~100",
    desc:"CNN Fear & Greed Index. 0=극단적 공포, 100=극단적 탐욕",
    levels:"0~25: 극단적 공포(매수 기회) / 25~45: 공포 / 45~55: 중립 / 55~75: 탐욕 / 75~100: 극단적 탐욕(과열 주의)",
  },
  {
    key:"vvix", label:"VVIX", icon:"📉",
    color:"#f43f5e", unit:"포인트",
    desc:"VIX의 변동성 (변동성의 변동성). VIX가 얼마나 격하게 움직일지를 예측",
    levels:"80 이하: 안정 / 80~100: 보통 / 100~120: 불안 / 120+: 위험·VIX 급등 가능성",
  },
  {
    key:"skew", label:"SKEW", icon:"📐",
    color:"#a78bfa", unit:"포인트",
    desc:"S&P500 꼬리 위험 지수. 시장 급락(블랙스완) 가능성을 옵션 가격으로 측정",
    levels:"100~120: 정상(꼬리 위험 낮음) / 120~140: 주의 / 140+: 경계(급락 위험 인식)",
  },
  {
    key:"pcr", label:"PCR (풋콜비율)", icon:"⚖️",
    color:"#34d399", unit:"비율",
    desc:"Put/Call Ratio. 풋옵션 거래량 ÷ 콜옵션 거래량. 투자자 방어 심리 강도",
    levels:"0.7 이하: 과도한 낙관(조정 위험) / 0.7~1.0: 중립 / 1.0~1.5: 방어적 / 1.5+: 극단적 공포(반등 신호)",
  },
  {
    key:"ovx", label:"OVX (원유 변동성)", icon:"🛢️",
    color:"#84cc16", unit:"포인트",
    desc:"원유 가격 변동성 지수. WTI 옵션 기반. 유가 불확실성 측정",
    levels:"20 이하: 안정 / 20~40: 보통 / 40~60: 불안 / 60+: 위기(유가 급변 가능성)",
  },
];

function AiMarketCard() {
  const [data, setData] = useState({}); // { fear_greed: {value, interpretation, fetched}, ... }
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0,10);
      const prompt = `오늘(${today}) 기준으로 다음 5개 금융 지표의 최신 현재값을 웹에서 검색해서 알려줘.
반드시 JSON 형식으로만 답해. 설명이나 마크다운 없이 JSON만.

{
  "fear_greed": { "value": "숫자값", "label": "상태명(극단적공포/공포/중립/탐욕/극단적탐욕)", "source": "출처날짜" },
  "vvix": { "value": "숫자값", "label": "상태명(안정/보통/불안/위험)", "source": "출처날짜" },
  "skew": { "value": "숫자값", "label": "상태명(정상/주의/경계)", "source": "출처날짜" },
  "pcr": { "value": "숫자값", "label": "상태명(낙관/중립/방어적/극단공포)", "source": "출처날짜" },
  "ovx": { "value": "숫자값", "label": "상태명(안정/보통/불안/위기)", "source": "출처날짜" }
}

값을 찾지 못하면 value를 "N/A"로. 검색 후 실제 최신값을 넣어줘.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:[{ role:"user", content: prompt }],
        }),
      });
      const json = await res.json();
      // 텍스트 블록만 추출
      const text = (json.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");
      // JSON 파싱
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setData(parsed);
        setLastFetched(new Date().toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit" }));
      }
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  const statusColor = (key, val) => {
    const v = parseFloat(val);
    if (isNaN(v)) return "#475569";
    if (key==="fear_greed") return v<25?"#f87171":v<45?"#fb923c":v<55?"#fbbf24":v<75?"#4ade80":"#f43f5e";
    if (key==="vvix")       return v<80?"#34d399":v<100?"#fbbf24":v<120?"#fb923c":"#f87171";
    if (key==="skew")       return v<120?"#34d399":v<140?"#fbbf24":"#f87171";
    if (key==="pcr")        return v<0.7?"#f43f5e":v<1.0?"#34d399":v<1.5?"#fbbf24":"#f87171";
    if (key==="ovx")        return v<20?"#34d399":v<40?"#fbbf24":v<60?"#fb923c":"#f87171";
    return "#94a3b8";
  };

  return (
    <div style={{
      background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:16, padding:"18px 18px 14px",
      display:"flex", flexDirection:"column", gap:12,
    }}>
      {/* 헤더 */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11.5, color:"#64748b", marginBottom:2 }}>
            🤖 AI 조회 시장 지표
          </div>
          <div style={{ fontSize:10, color:"#334155" }}>
            VVIX · SKEW · PCR · OVX · 공포탐욕지수
          </div>
        </div>
        <button onClick={fetchAll} disabled={loading}
          style={{
            display:"flex", alignItems:"center", gap:6,
            fontSize:12, padding:"7px 14px", borderRadius:10, cursor: loading?"wait":"pointer",
            background: loading?"rgba(255,255,255,0.04)":"linear-gradient(135deg,#6366f1,#3b82f6)",
            border:"none", color: loading?"#475569":"#fff", fontWeight:600,
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? (
            <><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⟳</span> 조회 중…</>
          ) : "🔍 최신값 조회"}
        </button>
      </div>

      {/* 미조회 안내 */}
      {Object.keys(data).length === 0 && !loading && (
        <div style={{
          background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)",
          borderRadius:10, padding:"14px 16px", fontSize:12, color:"#94a3b8", lineHeight:1.7,
          textAlign:"center",
        }}>
          <div style={{ fontSize:20, marginBottom:6 }}>🤖</div>
          <div>위 <strong style={{ color:"#c7d2fe" }}>최신값 조회</strong> 버튼을 누르면</div>
          <div>Claude AI가 웹 검색으로 최신 지표값을 가져옵니다.</div>
          <div style={{ fontSize:10.5, color:"#475569", marginTop:6 }}>
            CBOE 등에서 검색 · 완전 실시간은 아닐 수 있음
          </div>
        </div>
      )}

      {/* 로딩 중 */}
      {loading && (
        <div style={{ textAlign:"center", padding:"20px 0", color:"#64748b", fontSize:12 }}>
          <div style={{ fontSize:24, marginBottom:8, animation:"pulse 1.5s infinite" }}>🔍</div>
          웹 검색 중… 잠시만 기다려 주세요
        </div>
      )}

      {/* 결과 카드들 */}
      {!loading && Object.keys(data).length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {AI_METRICS.map(m => {
            const d = data[m.key];
            const val = d?.value ?? "—";
            const lbl = d?.label ?? "";
            const src = d?.source ?? "";
            const sc  = statusColor(m.key, val);
            const isExpanded = expandedKey === m.key;

            return (
              <div key={m.key} style={{
                background:"rgba(255,255,255,0.025)",
                border:"1px solid rgba(255,255,255,0.06)",
                borderLeft:"3px solid "+m.color,
                borderRadius:10, overflow:"hidden",
              }}>
                {/* 메인 행 */}
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px" }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{m.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:10.5, color:"#64748b", marginBottom:1 }}>{m.label}</div>
                    <div style={{ fontSize:10, color:"#334155" }}>{m.unit}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:22, fontWeight:800, color:m.color, letterSpacing:-0.5 }}>
                      {val}
                    </div>
                    {lbl && (
                      <span style={{ fontSize:10, color:sc, background:sc+"18",
                        border:"1px solid "+sc+"44", padding:"1px 7px", borderRadius:99 }}>
                        {lbl}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setExpandedKey(isExpanded ? null : m.key)}
                    style={{ background:"transparent", border:"none", color:"#475569",
                      fontSize:14, cursor:"pointer", padding:"2px 4px", flexShrink:0,
                      transform: isExpanded?"rotate(90deg)":"none", transition:"transform .2s" }}>
                    ›
                  </button>
                </div>

                {/* 펼치기: 설명 + 기준 */}
                {isExpanded && (
                  <div style={{ padding:"0 14px 12px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize:11.5, color:"#94a3b8", lineHeight:1.7, marginTop:8, marginBottom:6 }}>
                      {m.desc}
                    </div>
                    <div style={{ fontSize:10.5, color:"#64748b", background:"rgba(255,255,255,0.02)",
                      borderRadius:7, padding:"7px 10px", lineHeight:1.7 }}>
                      📏 {m.levels}
                    </div>
                    {src && (
                      <div style={{ fontSize:9.5, color:"#334155", marginTop:6 }}>
                        📅 출처 기준: {src}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ fontSize:10, color:"#334155", textAlign:"right" }}>
            마지막 조회: {lastFetched}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ 지준·TGA 변화량 통합 카드 ═══════════════════ */
function LiquidityDeltaCard() {
  const [period, setPeriod] = useState("1Y");
  const [showDetail, setShowDetail] = useState(null); // "reserves"|"tga"|null

  const years = PERIOD_YEARS[period];

  // 두 시계열을 date 기준으로 합쳐서 하나의 차트 데이터로
  const chartData = (() => {
    const rSlice = filterByYears(RESERVES_DELTA_HISTORY, years);
    const tSlice = filterByYears(TGA_DELTA_HISTORY, years);
    const map = {};
    rSlice.forEach(d => { map[d.date] = { date: d.date, "지준 변화": d.value }; });
    tSlice.forEach(d => {
      if (map[d.date]) map[d.date]["TGA 변화"] = d.value;
      else map[d.date] = { date: d.date, "TGA 변화": d.value };
    });
    return Object.values(map).sort((a,b) => a.date.localeCompare(b.date));
  })();

  const lastR = RESERVES_DELTA_HISTORY[RESERVES_DELTA_HISTORY.length - 1];
  const lastT = TGA_DELTA_HISTORY[TGA_DELTA_HISTORY.length - 1];
  const rColor = v => v > 30 ? "#34d399" : v > -30 ? "#fbbf24" : "#f87171";
  const tColor = v => v > 30 ? "#f87171" : v > -30 ? "#fbbf24" : "#34d399"; // TGA는 역방향 해석

  const detailMeta = showDetail === "reserves"
    ? DELTA_INDICATORS.reserves_delta
    : DELTA_INDICATORS.tga_delta;

  return (
    <>
      {/* 상세보기 모달 */}
      {showDetail && (
        <div onClick={() => setShowDetail(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)",
            backdropFilter:"blur(5px)", zIndex:1000,
            display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20, width:"100%", maxWidth:500, maxHeight:"85vh", overflow:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)",
              position:"sticky", top:0, background:"#0f172a" }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>
                📖 {detailMeta.label} — 상세 가이드
              </span>
              <button onClick={() => setShowDetail(null)}
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:8, color:"#94a3b8", fontSize:14, cursor:"pointer", padding:"4px 10px" }}>✕</button>
            </div>
            <div style={{ padding:"16px 20px 24px" }}>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>💡 개념</div>
                <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.75, margin:0 }}>{detailMeta.detail.concept}</p>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>📏 수치 기준</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {detailMeta.detail.levels.map((lv, i) => (
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start",
                      background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px",
                      borderLeft:"3px solid "+lv.color }}>
                      <div style={{ minWidth:90, flexShrink:0 }}>
                        <div style={{ fontSize:10.5, color:lv.color, fontWeight:700, marginBottom:3 }}>{lv.range}</div>
                        <span style={{ fontSize:10, color:lv.color, background:lv.color+"22", padding:"1px 6px", borderRadius:99 }}>{lv.label}</span>
                      </div>
                      <span style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{lv.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>🔗 투자 팁</div>
                <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
                  borderRadius:10, padding:"12px 14px", fontSize:12.5, color:"#c7d2fe", lineHeight:1.7 }}>
                  {detailMeta.detail.tip}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"18px 18px 14px", display:"flex", flexDirection:"column", gap:10 }}>

        {/* 타이틀 */}
        <div style={{ fontSize:11.5, color:"#64748b", letterSpacing:"0.04em" }}>
          💧 지급준비금 · TGA 변화량 비교 <span style={{ fontSize:9.5, color:"#334155" }}>(전기 대비 증감 · $B)</span>
        </div>

        {/* 최신값 두 개 나란히 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {/* 지준 변화량 */}
          <div style={{ background:"rgba(34,211,238,0.05)", borderRadius:12, padding:"10px 14px",
            border:"1px solid rgba(34,211,238,0.15)" }}>
            <div style={{ fontSize:9.5, color:"#22d3ee", marginBottom:3 }}>💵 지준 변화량</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#22d3ee", letterSpacing:-0.5 }}>
              {(lastR.value >= 0 ? "+" : "") + lastR.value}B
            </div>
            <div style={{ fontSize:9.5, marginTop:3,
              color: rColor(lastR.value),
              background: rColor(lastR.value)+"18",
              display:"inline-block", padding:"1px 8px", borderRadius:99 }}>
              {DELTA_INDICATORS.reserves_delta.interpret(lastR.value)}
            </div>
            <br/>
            <button onClick={() => setShowDetail("reserves")}
              style={{ marginTop:6, fontSize:9.5, padding:"2px 8px", borderRadius:5, cursor:"pointer",
                background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)",
                color:"#22d3ee" }}>📖 상세</button>
          </div>

          {/* TGA 변화량 */}
          <div style={{ background:"rgba(248,113,113,0.05)", borderRadius:12, padding:"10px 14px",
            border:"1px solid rgba(248,113,113,0.15)" }}>
            <div style={{ fontSize:9.5, color:"#f87171", marginBottom:3 }}>🏛️ TGA 변화량</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#f87171", letterSpacing:-0.5 }}>
              {(lastT.value >= 0 ? "+" : "") + lastT.value}B
            </div>
            <div style={{ fontSize:9.5, marginTop:3,
              color: tColor(lastT.value),
              background: tColor(lastT.value)+"18",
              display:"inline-block", padding:"1px 8px", borderRadius:99 }}>
              {DELTA_INDICATORS.tga_delta.interpret(lastT.value)}
            </div>
            <br/>
            <button onClick={() => setShowDetail("tga")}
              style={{ marginTop:6, fontSize:9.5, padding:"2px 8px", borderRadius:5, cursor:"pointer",
                background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)",
                color:"#f87171" }}>📖 상세</button>
          </div>
        </div>

        {/* 시소 해석 */}
        {(() => {
          const seesaw = lastR.value > 30 && lastT.value < -30
            ? { msg:"지준↑ + TGA↓ — 정부 지출이 유동성을 공급하는 완화 국면", color:"#34d399" }
            : lastR.value < -30 && lastT.value > 30
            ? { msg:"지준↓ + TGA↑ — 재무부가 유동성을 흡수하는 긴축 국면", color:"#f87171" }
            : { msg:"뚜렷한 시소 신호 없음 — 변동 폭이 작거나 방향이 혼재", color:"#fbbf24" };
          return (
            <div style={{ fontSize:11, color:seesaw.color, padding:"6px 10px",
              background:seesaw.color+"10", border:"1px solid "+seesaw.color+"33",
              borderRadius:7, lineHeight:1.5 }}>
              ⇄ {seesaw.msg}
            </div>
          );
        })()}

        {/* 기간 토글 */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#334155" }}>추이 (최근 {period})</span>
          <div style={{ display:"flex", gap:3 }}>
            {["1Y","3Y","5Y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ fontSize:10.5, padding:"2px 9px", borderRadius:6, cursor:"pointer",
                  border:"none",
                  background: period===p ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.04)",
                  color: period===p ? "#22d3ee" : "#475569",
                  outline: period===p ? "1px solid rgba(34,211,238,0.4)" : "none" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 이중 라인 차트 + 0 기준선 */}
        <div style={{ height:150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top:4, right:12, bottom:4, left:0 }}>
              <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} interval="preserveStartEnd"
                tickFormatter={v => v.slice(0,7)} minTickGap={40} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }}
                tickFormatter={v => (v>=0?"+":"")+v+"B"}
                width={52} tickCount={5} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, fontSize:11 }}
                labelStyle={{ color:"#64748b" }}
                formatter={(v, name) => [(v>=0?"+":"")+v+"B", name]}
              />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} strokeDasharray="4 3" />
              <Line type="monotone" dataKey="지준 변화" stroke="#22d3ee" strokeWidth={2.5}
                dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="TGA 변화" stroke="#f87171" strokeWidth={2.5}
                dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 + 시소 설명 */}
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:10.5, color:"#22d3ee", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:16, height:2, background:"#22d3ee", display:"inline-block", borderRadius:2 }} />
            지준 변화 (↑ = 유동성 증가)
          </span>
          <span style={{ fontSize:10.5, color:"#f87171", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:16, height:2, background:"#f87171", display:"inline-block", borderRadius:2 }} />
            TGA 변화 (↑ = 유동성 흡수)
          </span>
        </div>

        <div style={{ fontSize:9.5, color:"#1e3a5f" }}>
          최신: {lastR.date} · 두 선이 반대 방향이면 시소(긴축↔완화) 작동 중
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ 지표 카드 ═══════════════════ */
function IndicatorCard({ indKey }) {
  // INDICATORS 또는 DELTA_INDICATORS 둘 다 조회
  const meta = INDICATORS[indKey] || DELTA_INDICATORS[indKey];
  const [period, setPeriod] = useState("1Y");
  const [showDetail, setShowDetail] = useState(false);

  const raw = meta.rawData;
  const last = raw[raw.length - 1];
  const prev = raw[raw.length - 2];
  const curVal  = last[meta.field];
  const prevVal = prev[meta.field];
  const diff    = curVal - prevVal;
  const diffUp  = diff > 0;
  const statusColor = meta.statusColor(curVal);
  const statusLabel = meta.interpret(curVal);

  const years = PERIOD_YEARS[period];
  const chartData = filterByYears(raw, years).map(d => ({ date: d.date, value: d[meta.field] }));

  // delta 모드: 값이 양수면 초록, 음수면 빨강으로 Y축 포맷
  const isDelta = !!meta.isDelta;

  const yFmt = v => {
    if (isDelta) return (v>=0?"+":"")+v+"B";
    if (meta.unit === "%") return v.toFixed(1)+"%";
    if (meta.unit === "B$") return v>=1000?(v/1000).toFixed(1)+"조":v+"B";
    if (meta.unit === "$/oz"||meta.unit === "$/bbl"||meta.unit === "$")
      return v>=1000?"$"+(v/1000).toFixed(0)+"k":"$"+v;
    if (meta.unit === "¥") return "¥"+v.toFixed(0);
    if (meta.unit === "₩") return "₩"+v.toLocaleString();
    return v.toFixed(2);
  };

  return (
    <>
      {showDetail && (
        // delta 지표는 DELTA_INDICATORS에 있으므로 모달 직접 렌더
        <div onClick={() => setShowDetail(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)",
            backdropFilter:"blur(5px)", zIndex:1000,
            display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20, width:"100%", maxWidth:500, maxHeight:"85vh", overflow:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)",
              position:"sticky", top:0, background:"#0f172a" }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>
                📖 {meta.label} — 상세 가이드
              </span>
              <button onClick={() => setShowDetail(false)}
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:8, color:"#94a3b8", fontSize:14, cursor:"pointer", padding:"4px 10px" }}>✕</button>
            </div>
            <div style={{ padding:"16px 20px 24px" }}>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>💡 개념</div>
                <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.75, margin:0 }}>{meta.detail.concept}</p>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>📏 수치 기준</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {meta.detail.levels.map((lv, i) => (
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start",
                      background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px",
                      borderLeft:"3px solid "+lv.color }}>
                      <div style={{ minWidth:90, flexShrink:0 }}>
                        <div style={{ fontSize:10.5, color:lv.color, fontWeight:700, marginBottom:3 }}>{lv.range}</div>
                        <span style={{ fontSize:10, color:lv.color, background:lv.color+"22", padding:"1px 6px", borderRadius:99 }}>{lv.label}</span>
                      </div>
                      <span style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{lv.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color:"#475569", textTransform:"uppercase", marginBottom:8 }}>🔗 투자 팁</div>
                <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
                  borderRadius:10, padding:"12px 14px", fontSize:12.5, color:"#c7d2fe", lineHeight:1.7 }}>
                  {meta.detail.tip}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:"rgba(15,23,42,0.85)",
        border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:16, padding:"18px 18px 14px",
        display:"flex", flexDirection:"column", gap:10 }}>

        {/* 헤더: 이름 + 상태 뱃지 */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <span style={{ fontSize:11.5, color:"#64748b", letterSpacing:"0.04em" }}>
              {meta.label}
            </span>
            {isDelta && (
              <span style={{ fontSize:9.5, color:"#334155", marginLeft:6 }}>전기 대비 변화량</span>
            )}
          </div>
          <span style={{ fontSize:10.5, fontWeight:700, color:statusColor,
            background:statusColor+"22", padding:"2px 9px", borderRadius:99,
            border:"1px solid "+statusColor+"44", whiteSpace:"nowrap" }}>
            {statusLabel}
          </span>
        </div>

        {/* 현재값 + 전월 대비 */}
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
          <span style={{ fontSize:28, fontWeight:800, color:meta.color, letterSpacing:-0.5 }}>
            {meta.fmt(curVal)}
          </span>
          {!isDelta && (
            <span style={{ fontSize:11, color: diffUp ? "#4ade80" : "#f87171" }}>
              {diffUp ? "▲" : "▼"} {meta.diffFmt(Math.abs(diff))}
              <span style={{ color:"#334155", marginLeft:3 }}>전월비</span>
            </span>
          )}
        </div>

        {/* 간략 해석 */}
        <div style={{ fontSize:11.5, color:"#94a3b8", lineHeight:1.6,
          padding:"7px 10px", background:"rgba(255,255,255,0.025)", borderRadius:7,
          borderLeft:"2px solid "+statusColor }}>
          {isDelta
            ? (curVal >= 0
                ? `+${curVal.toFixed(0)}B — ${meta.interpret(curVal)}: 유동성 확대 방향`
                : `${curVal.toFixed(0)}B — ${meta.interpret(curVal)}: 유동성 축소 방향`)
            : meta.detail.tip.slice(0, 80)+"…"}
        </div>

        {/* 기간 토글 */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#334155" }}>추이 (최근 {period})</span>
          <div style={{ display:"flex", gap:3 }}>
            {["1Y","3Y","5Y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ fontSize:10.5, padding:"2px 9px", borderRadius:6, cursor:"pointer",
                  border:"none",
                  background: period===p ? meta.color+"33" : "rgba(255,255,255,0.04)",
                  color: period===p ? meta.color : "#475569",
                  outline: period===p ? "1px solid "+meta.color+"66" : "none" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 차트 */}
        <div style={{ height:130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top:4, right:12, bottom:4, left:0 }}>
              <XAxis dataKey="date" tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }} interval="preserveStartEnd"
                tickFormatter={v => v.slice(0,7)} minTickGap={40} />
              <YAxis tick={{ fill:"#475569", fontSize:10 }} tickLine={false}
                axisLine={{ stroke:"#1e293b" }}
                tickFormatter={yFmt}
                width={48} tickCount={4} domain={["auto","auto"]} />
              <Tooltip
                contentStyle={{ background:"#0f172a", border:"1px solid #1e293b",
                  borderRadius:8, fontSize:11 }}
                labelStyle={{ color:"#64748b" }}
                formatter={(v) => [meta.fmt(v), meta.label]}
              />
              {/* delta 모드: 0 기준선 강조 */}
              {isDelta && (
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5}
                  strokeDasharray="4 3" />
              )}
              <Line type="monotone" dataKey="value"
                stroke={meta.color} strokeWidth={2}
                dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* delta 모드: 양수/음수 의미 뱃지 */}
        {isDelta && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:"#34d399", background:"rgba(52,211,153,0.08)",
              border:"1px solid rgba(52,211,153,0.2)", padding:"2px 8px", borderRadius:6 }}>
              ▲ 양(+): 지준 증가 / TGA 흡수
            </span>
            <span style={{ fontSize:10, color:"#f87171", background:"rgba(248,113,113,0.08)",
              border:"1px solid rgba(248,113,113,0.2)", padding:"2px 8px", borderRadius:6 }}>
              ▼ 음(−): 지준 감소 / TGA 방출
            </span>
          </div>
        )}

        {/* 최신 날짜 + 상세보기 버튼 */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:9.5, color:"#1e3a5f" }}>
            최신: {chartData[chartData.length - 1]?.date}
          </span>
          <button onClick={() => setShowDetail(true)}
            style={{ fontSize:11, padding:"4px 12px", borderRadius:8, cursor:"pointer",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              color:"#94a3b8" }}>
            📖 상세보기
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ 메인 앱 ═══════════════════ */
export default function MacroDashboard() {
  const [activeTab, setActiveTab] = useState("rates");
  const tab = TABS.find(t => t.key === activeTab);

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600000);
  const timeStr = kst.toISOString().slice(0, 16).replace("T", " ") + " KST";

  return (
    <div style={{ minHeight:"100vh", background:"#020617",
      backgroundImage:"radial-gradient(ellipse 80% 35% at 50% 0%, rgba(30,58,138,0.2) 0%, transparent 60%)",
      color:"#f1f5f9", padding:"24px 18px 60px" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }
        button { transition:all .15s; cursor:pointer; }
        button:hover { opacity:.8; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* 헤더 */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:"0.25em", color:"#1e3a5f",
            textTransform:"uppercase", marginBottom:6 }}>MACRO DASHBOARD</div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0, letterSpacing:-0.5 }}>
            글로벌 매크로 대시보드
          </h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7,
          fontSize:11, color:"#475569",
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
          padding:"5px 12px", borderRadius:99 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e",
            display:"inline-block", animation:"pulse 2s infinite" }} />
          {timeStr}
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display:"flex", gap:0, marginBottom:20,
        background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:12, padding:4, flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
              gap:6, border:"none", borderRadius:8, padding:"10px 8px", minWidth:70,
              background: activeTab===t.key ? t.color+"22" : "transparent",
              color: activeTab===t.key ? t.color : "#475569",
              fontWeight: activeTab===t.key ? 700 : 400,
              borderBottom: activeTab===t.key ? "2px solid "+t.color : "2px solid transparent" }}>
            <span style={{ fontSize:15 }}>{t.icon}</span>
            <span style={{ fontSize:12 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 서브 안내 */}
      <div style={{ fontSize:11, color:"#334155", marginBottom:18, paddingLeft:2 }}>
        {tab.keys.length}개 지표 · 각 카드에서 1Y / 3Y / 5Y 추이 확인 · 📖 상세보기로 개념·기준 확인
      </div>

      {/* 카드 그리드 */}
      <div style={{ display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",
        gap:12, animation:"fadeUp .3s ease both" }}>
        {tab.keys.map((k, i) => {
          if (k === "kr_us_rate") return (
            <div key={k} style={{ gridColumn:"1 / -1" }}>
              <DualRateCard />
            </div>
          );
          if (k === "rate_spread")    return <SpreadCard key={k} />;
          if (k === "us_triple_yield") return (
            <div key={k} style={{ gridColumn:"1 / -1" }}>
              <TripleYieldCard />
            </div>
          );
          if (k === "term_spread")    return <TermSpreadCard key={k} />;
          if (k === "ai_market")      return (
            <div key={k} style={{ gridColumn:"1 / -1" }}>
              <AiMarketCard />
            </div>
          );
          if (k === "liquidity_delta") return (
            <div key={k} style={{ gridColumn:"1 / -1" }}>
              <LiquidityDeltaCard />
            </div>
          );
          return <IndicatorCard key={k} indKey={k} />;
        })}
      </div>

      <div style={{ marginTop:32, textAlign:"center", fontSize:10.5,
        color:"#1e293b", lineHeight:1.9 }}>
        데이터 출처: St. Louis Fed (FRED) · 한국은행 · 미 재무부 · 서울외국환중개
        <br/>본 대시보드는 학습·정보 목적이며 투자 자문이 아닙니다.
      </div>
    </div>
  );
}
