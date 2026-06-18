const positions = [
  { key: "year", label: "年", fate: "年度底色", change: "年度变化" },
  { key: "month", label: "月", fate: "月度气场", change: "月度触发" },
  { key: "day", label: "日", fate: "当日承接", change: "当日事件" },
  { key: "hour", label: "时", fate: "行动习惯", change: "即时转向" },
];

const suitMeanings = {
  "♥": {
    name: "红桃",
    theme: "情感、人际与内在感受",
    advice: "先照顾关系里的温度，再谈效率。",
    score: "emotion",
    color: "red",
  },
  "♦": {
    name: "方块",
    theme: "金钱、资源与现实选择",
    advice: "把机会落到数字、时间和边界上。",
    score: "wealth",
    color: "red",
  },
  "♣": {
    name: "梅花",
    theme: "行动、学习与协作推进",
    advice: "主动沟通，今天的好运多在动起来之后出现。",
    score: "action",
    color: "black",
  },
  "♠": {
    name: "黑桃",
    theme: "压力、判断与必要的取舍",
    advice: "慢一点做决定，清理阻碍比硬冲更有用。",
    score: "warning",
    color: "black",
  },
};

const rankMeanings = {
  A: "新的开端、第一念头和可被点燃的机会",
  2: "选择、配合与关系里的平衡",
  3: "表达、扩展和来自他人的回应",
  4: "稳定、规则、基础工作与秩序感",
  5: "变动、试探、临时插曲与突破口",
  6: "修复、照顾、互助与逐渐回稳",
  7: "观察、等待、隐藏信息与内在判断",
  8: "执行、效率、重复练习和实际成果",
  9: "收尾、验收、情绪峰值与阶段答案",
  10: "完成、转换、公开结果与下一轮开始",
  J: "消息、年轻能量、灵活应对和临场反应",
  Q: "成熟感受、审美、人情判断与照拂能力",
  K: "掌控、责任、规则制定与关键人物",
};

const jokerMeanings = {
  "BLACK-JOKER": {
    name: "小王",
    rank: "Joker",
    suit: "★",
    color: "black",
    theme: "未知变量、反转、脱离旧剧本",
    advice: "不要急着定论，保留一个弹性方案会救场。",
  },
  "RED-JOKER": {
    name: "大王",
    rank: "Joker",
    suit: "☆",
    color: "red",
    theme: "放大、跃迁、突然出现的强信号",
    advice: "机会来得快，先确认代价，再决定是否加码。",
  },
};

const form = document.querySelector("#fortuneForm");
const nowText = document.querySelector("#nowText");
const quickNow = document.querySelector("#quickNow");
const fillNow = document.querySelector("#fillNow");
const birthCards = document.querySelector("#birthCards");
const nowCards = document.querySelector("#nowCards");
const readingList = document.querySelector("#readingList");
const resultIntro = document.querySelector("#resultIntro");
const scoreBoard = document.querySelector("#scoreBoard");
const summaryPanel = document.querySelector("#summaryPanel");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryText = document.querySelector("#summaryText");
const summaryAdvice = document.querySelector("#summaryAdvice");
const funPanel = document.querySelector("#funPanel");
const relationshipText = document.querySelector("#relationshipText");
const travelText = document.querySelector("#travelText");
const tabooText = document.querySelector("#tabooText");
const luckyText = document.querySelector("#luckyText");
const externalLinks = document.querySelector("#externalLinks");
const externalLinksList = document.querySelector("#externalLinksList");

let displayedMoment = new Date();

function buildDeck() {
  const suits = ["♥", "♦", "♣", "♠"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const cards = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      cards.push({
        id: `${suit}${rank}`,
        name: `${suitMeanings[suit].name}${rank}`,
        suit,
        rank,
        color: suitMeanings[suit].color,
        theme: suitMeanings[suit].theme,
        advice: suitMeanings[suit].advice,
        rankText: rankMeanings[rank],
        score: suitMeanings[suit].score,
      });
    }
  }

  cards.push({ id: "BLACK-JOKER", ...jokerMeanings["BLACK-JOKER"], score: "warning", rankText: "意料之外的变量" });
  cards.push({ id: "RED-JOKER", ...jokerMeanings["RED-JOKER"], score: "action", rankText: "能量被突然放大" });
  return cards;
}

function hashSeed(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickCard(deck, seedText) {
  const index = hashSeed(seedText) % deck.length;
  return deck.splice(index, 1)[0];
}

function formatMoment(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()} 年 ${pad(date.getMonth() + 1)} 月 ${pad(date.getDate())} 日 ${pad(date.getHours())} 时`;
}

function getMomentParts(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
  };
}

function fillTargetFromDate(date) {
  const parts = getMomentParts(date);
  document.querySelector("#targetYear").value = parts.year;
  document.querySelector("#targetMonth").value = parts.month;
  document.querySelector("#targetDay").value = parts.day;
  document.querySelector("#targetHour").value = String(parts.hour);
  displayedMoment = date;
  nowText.textContent = `当前已选：${formatMoment(date)}`;
}

function buildDateFromParts(year, month, day, hour) {
  const date = new Date(year, month - 1, day, hour);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour
  ) {
    return null;
  }
  return date;
}

function syncNow() {
  fillTargetFromDate(new Date());
}

function renderExternalLinks(links) {
  if (!externalLinks || !externalLinksList || !Array.isArray(links) || links.length === 0) return;

  externalLinksList.innerHTML = "";
  links.forEach((item) => {
    if (!item || !item.title || !item.url) return;

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const title = document.createElement("strong");
    title.textContent = item.title;
    link.appendChild(title);

    if (item.description) {
      const description = document.createElement("span");
      description.textContent = item.description;
      link.appendChild(description);
    }

    externalLinksList.appendChild(link);
  });

  externalLinks.hidden = externalLinksList.children.length === 0;
}

async function loadExternalLinks() {
  try {
    const response = await fetch("./links.json", { cache: "no-store" });
    if (!response.ok) return;
    const links = await response.json();
    renderExternalLinks(links);
  } catch (error) {
    renderExternalLinks([
      {
        title: "链接配置说明",
        description: "发布到网站后，编辑 links.json 即可显示自己的链接。",
        url: "./links.json",
      },
    ]);
  }
}

function createCard(card, position, index) {
  const div = document.createElement("article");
  div.className = `fortune-card ${card.color} ${card.id.includes("JOKER") ? "joker" : ""}`;
  div.style.setProperty("--tilt", `${[-2, 1.5, -1, 2][index]}deg`);
  div.style.animationDelay = `${index * 0.08}s`;
  div.innerHTML = `
    <div class="card-position">${position}</div>
    <div class="card-rank">${card.rank}</div>
    <div class="card-suit">${card.suit}</div>
    <div class="card-name">${card.name}</div>
  `;
  return div;
}

function drawCards(values) {
  const deck = buildDeck();
  const birthSeeds = [values.birthYear, values.birthMonth, values.birthDay, values.birthHour];
  const targetSeeds = [values.targetYear, values.targetMonth, values.targetDay, values.targetHour];

  // Birthday cards depend only on the birthday, so the fate spread stays consistent across predictions.
  const birth = birthSeeds.map((value, index) =>
    pickCard(deck, `birth:${positions[index].key}:${value}:${birthSeeds.join("-")}`)
  );
  const now = targetSeeds.map((value, index) =>
    pickCard(deck, `target:${positions[index].key}:${value}:${targetSeeds.join("-")}:${birthSeeds.join("-")}`)
  );

  return { birth, now, targetSeeds };
}

function renderCards(group, container, labelKind) {
  container.innerHTML = "";
  group.forEach((card, index) => {
    const label = `${positions[index].label} · ${labelKind === "fate" ? positions[index].fate : positions[index].change}`;
    container.appendChild(createCard(card, label, index));
  });
}

function cardSentence(card, position, groupName) {
  if (card.id.includes("JOKER")) {
    return `${card.name}落在${position.label}位，代表${groupName}里有“${card.theme}”。${card.advice}`;
  }

  return `${card.name}落在${position.label}位，花色指向${card.theme}，点数提示${card.rankText}。${card.advice}`;
}

function renderReading(birth, now, targetDate) {
  readingList.innerHTML = "";
  const fragments = [];

  positions.forEach((position, index) => {
    fragments.push({
      title: `${position.label}位 · 命运底色`,
      text: cardSentence(birth[index], position, "生日命盘"),
    });
    fragments.push({
      title: `${position.label}位 · 变化运势`,
      text: cardSentence(now[index], position, "预测时间"),
    });
  });

  fragments.forEach((item) => {
    const div = document.createElement("article");
    div.className = "reading-item";
    div.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    readingList.appendChild(div);
  });

  const focus = now[2].id.includes("JOKER") ? now[2].theme : now[2].theme;
  const base = birth[0].id.includes("JOKER") ? birth[0].theme : birth[0].theme;
  resultIntro.textContent = `${formatMoment(targetDate)} 的主轴：以“${base}”作为命运底色，遇到“${focus}”带来的变化。`;
}

function calculateScores(cards) {
  const scores = { emotion: 0, wealth: 0, action: 0, warning: 0 };
  cards.forEach((card) => {
    scores[card.score] += card.id.includes("JOKER") ? 3 : 2;
    if (["A", "8", "10", "K"].includes(card.rank)) scores[card.score] += 1;
  });
  return scores;
}

function renderScores(scores) {
  const labels = [
    ["emotion", "情感"],
    ["wealth", "财富"],
    ["action", "行动"],
    ["warning", "提醒"],
  ];

  scoreBoard.innerHTML = labels
    .map(([key, label]) => `<div><span>${label}</span><strong>${Math.min(scores[key], 9)}/9</strong></div>`)
    .join("");
}

function renderSummary(birth, now, scores, targetDate) {
  const allCards = [...birth, ...now];
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topKey = sortedScores[0][0];
  const secondKey = sortedScores[1][0];
  const labels = {
    emotion: "人际情感",
    wealth: "财富资源",
    action: "行动推进",
    warning: "压力提醒",
  };
  const moodByTop = {
    emotion: "目前运势偏向人际与情绪联动",
    wealth: "目前运势偏向现实资源与机会盘点",
    action: "目前运势偏向主动推进与快速执行",
    warning: "目前运势偏向谨慎判断与避开阻力",
  };
  const dayCard = now[2];
  const jokerCount = allCards.filter((card) => card.id.includes("JOKER")).length;
  const spadeCount = allCards.filter((card) => card.suit === "♠").length;
  const powerCount = allCards.filter((card) => ["A", "8", "10", "K"].includes(card.rank)).length;

  let level = "平稳中带机会";
  if (scores.warning >= 7 && scores.action <= 4) level = "阻力较明显，宜守中求稳";
  if (scores.action >= 7 && scores.warning <= 5) level = "推进力较强，适合主动出手";
  if (scores.wealth >= 7) level = "资源感走强，适合谈条件与做规划";
  if (scores.emotion >= 7) level = "人缘与感受力走强，适合沟通修复";
  if (jokerCount > 0) level = `${level}，但有突发变量`;

  const riskText =
    spadeCount >= 3
      ? "黑桃较多，说明压力、规则或取舍感偏强，不宜凭一时情绪硬冲。"
      : "压力牌不算过重，只要节奏清楚，事情有机会被顺势推动。";
  const powerText =
    powerCount >= 3
      ? "强点数较多，代表这段时间有完成、掌控或快速见结果的可能。"
      : "强点数适中，适合先做小步验证，再逐渐扩大行动。";

  summaryPanel.hidden = false;
  summaryTitle.textContent = `${formatMoment(targetDate)}：${level}`;
  summaryText.textContent = `综合 8 张牌来看，${moodByTop[topKey]}，其次受“${labels[secondKey]}”影响。预测日位落到${dayCard.name}，当天事件的核心会围绕“${dayCard.theme}”展开。${riskText}${powerText}`;
  summaryAdvice.textContent = `建议：先抓住“${labels[topKey]}”这条主线，再用“${labels[secondKey]}”做辅助；当天最忌分心，最宜把关键决定落到一个明确动作上。`;
}

function countSuit(cards, suit) {
  return cards.filter((card) => card.suit === suit).length;
}

function renderFunInsights(birth, now, scores) {
  const allCards = [...birth, ...now];
  const dayCard = now[2];
  const hourCard = now[3];
  const jokerCount = allCards.filter((card) => card.id.includes("JOKER")).length;
  const hearts = countSuit(allCards, "♥");
  const diamonds = countSuit(allCards, "♦");
  const clubs = countSuit(allCards, "♣");
  const spades = countSuit(allCards, "♠");

  const relationship =
    hearts >= 3
      ? "人际温度较高，适合约见、谈和、表达感谢；但别把所有情绪都摊开，留一点余地更顺。"
      : hearts === 0
        ? "人际牌偏少，当天更适合处理事情本身，少卷入口舌评价；重要沟通建议简短、明确、留证据。"
        : "人际关系整体可控，适合轻量沟通、确认共识；若遇到误会，先问清事实再回应。";

  const travel =
    clubs >= 3
      ? "出行动能不错，适合跑手续、见客户、短途办事；路线可安排紧凑，但最好提前确认时间。"
      : spades >= 3
        ? "出行宜保守，避开赶路、绕路和临时改签；重要行程至少多留 20 分钟缓冲。"
        : diamonds >= 3
          ? "出行容易和花费、购物、付款有关；适合办采购和资源对接，记得检查票据与金额。"
          : "出行平稳，适合按原计划行动；临时邀约可接，但不宜为了面子改变主要安排。";

  let taboo = "忌同时推进太多事，忌没有确认就答应，忌把模糊消息当最终结论。";
  if (spades >= 3) taboo = "忌冲动争辩、忌冒险赶路、忌在压力下签字或做不可逆决定。";
  if (diamonds >= 3) taboo = "忌冲动消费、忌借钱担保、忌只看收益不看成本。";
  if (clubs >= 3) taboo = "忌嘴快承诺、忌频繁改计划、忌把小任务拖到最后一刻。";
  if (hearts >= 3) taboo = "忌翻旧账、忌过度试探、忌用情绪替代真实沟通。";
  if (jokerCount > 0) taboo += " 大小王出现时，还要忌临时起意的大动作。";

  const luckySuit = dayCard.suit === "★" || dayCard.suit === "☆" ? hourCard.suit : dayCard.suit;
  const luckyMap = {
    "♥": "幸运提示：暖色系、熟人牵线、饭局前后的闲聊会带来有用信息。",
    "♦": "幸运提示：数字、清单、收据和报价里藏着机会，适合把话说具体。",
    "♣": "幸运提示：主动发消息、提前出门、带齐工具，会让事情推进更顺。",
    "♠": "幸运提示：删减计划、避开争执、把风险写下来，反而更容易保住好运。",
  };
  const lucky = `${luckyMap[luckySuit] || "幸运提示：保持弹性，别急着定论。"} 当天关键牌是${dayCard.name}，临近行动看${hourCard.name}。`;

  funPanel.hidden = false;
  relationshipText.textContent = relationship;
  travelText.textContent = travel;
  tabooText.textContent = taboo;
  luckyText.textContent = lucky;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const values = {
    birthYear: Number(data.get("birthYear")),
    birthMonth: Number(data.get("birthMonth")),
    birthDay: Number(data.get("birthDay")),
    birthHour: Number(data.get("birthHour")),
    targetYear: Number(data.get("targetYear")),
    targetMonth: Number(data.get("targetMonth")),
    targetDay: Number(data.get("targetDay")),
    targetHour: Number(data.get("targetHour")),
  };

  const birthDate = buildDateFromParts(values.birthYear, values.birthMonth, values.birthDay, values.birthHour);
  const targetDate = buildDateFromParts(values.targetYear, values.targetMonth, values.targetDay, values.targetHour);
  if (!birthDate || !targetDate) {
    resultIntro.textContent = "日期不存在，请检查年月日时后再预测。";
    return;
  }

  displayedMoment = targetDate;
  nowText.textContent = `当前已选：${formatMoment(displayedMoment)}`;

  const { birth, now } = drawCards(values);
  renderCards(birth, birthCards, "fate");
  renderCards(now, nowCards, "change");
  const scores = calculateScores([...birth, ...now]);
  renderScores(scores);
  renderReading(birth, now, targetDate);
  renderSummary(birth, now, scores, targetDate);
  renderFunInsights(birth, now, scores);
});

quickNow.addEventListener("click", syncNow);
fillNow.addEventListener("click", syncNow);

syncNow();
loadExternalLinks();
renderCards(
  [
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
  ],
  birthCards,
  "fate"
);
renderCards(
  [
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
    { name: "牌背", rank: "?", suit: "◇", color: "black", id: "BACK" },
  ],
  nowCards,
  "change"
);
