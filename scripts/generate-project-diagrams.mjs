import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createServer as createNetServer } from 'node:net';
import { createServer } from 'vite';

const outputDir = join(process.cwd(), 'src/assets/project-diagrams');
const editableOutputDir = join(outputDir, 'editable');
const shouldOverwriteEditableDiagrams = process.env.FORCE_EDITABLE_DIAGRAMS === '1';
mkdirSync(outputDir, { recursive: true });
mkdirSync(editableOutputDir, { recursive: true });

const palette = {
  background: '#fffaf0',
  ink: '#1a3a3a',
  frame: '#d8cf8a',
  entry: ['#e7f5ff', '#4dabf7'],
  process: ['#fffdf7', '#f03e5d'],
  decision: ['#fff1bf', '#fab005'],
  recovery: ['#fff4e6', '#fd7e14'],
  output: ['#e6f4ee', '#1a3a3a'],
};

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ko = {
  approval: {
    creator: 'Creator 제출',
    admin: 'Admin 승인 관리',
    agent: 'Slack agent 자동 승인',
    start: ['시작'],
    confidence: ['승인 근거', '판단'],
    note: '명확한 요청은 자동 승인, 애매한 요청은 수동 검토로 분리',
  },
  media: {
    backend: 'Backend 검증',
    safety: '상태·복구 게이트',
    worker: 'Worker 후처리',
    file: ['파일 선택'],
    upload: ['Browser → R2', '직접 업로드'],
    verify: ['R2 HEAD', '검증'],
  },
  feed: {
    main: '탐색 피드 렌더링 흐름',
    perf: '성능 보호 흐름',
    note: '화면 폭이 바뀌어도 같은 상품 순서와 미리보기 예산을 유지',
  },
  incident: {
    agent: 'Slack agent 대응',
    slack: ['Slack thread', '생성'],
    evidence: ['Context +', '근거 수집'],
    review: ['NEEDS_REVIEW', '보고'],
    issue: ['GitHub issue', '발행'],
    branch: ['Fix branch', '생성'],
    pr: ['Draft PR', '생성'],
  },
  redis: {
    main: '요청 보호 흐름',
    cost: '진단과 비용 제어',
    actor: ['Actor scope', '분리'],
    note: '평소에는 가볍게 보호하고, 필요할 때만 route-level 진단을 켬',
  },
  worker: {
    owner: ['Active owner', '확인'],
  },
};

const en = {
  approval: {
    creator: 'Creator submission',
    admin: 'Admin approval management',
    agent: 'Slack agent approval',
    start: ['Start'],
    confidence: ['Approval evidence', 'check'],
    note: 'Clear requests are auto-approved; ambiguous requests stay in manual review',
  },
  media: {
    backend: 'Backend verification',
    safety: 'Status and recovery gates',
    worker: 'Worker post-processing',
    file: ['File selected'],
    upload: ['Browser → R2', 'direct upload'],
    verify: ['R2 HEAD', 'verification'],
  },
  feed: {
    main: 'Feed rendering flow',
    perf: 'Performance protection flow',
    note: 'Preserves item order and preview budget across viewport changes',
  },
  incident: {
    agent: 'Slack agent response',
    slack: ['Slack thread', 'created'],
    evidence: ['Context +', 'evidence lookup'],
    review: ['NEEDS_REVIEW', 'reported'],
    issue: ['GitHub issue', 'created'],
    branch: ['Fix branch', 'created'],
    pr: ['Draft PR', 'created'],
  },
  redis: {
    main: 'Request protection flow',
    cost: 'Diagnostic and cost control',
    actor: ['Actor scope', 'separation'],
    note: 'Lightweight by default; route-level diagnostics on demand',
  },
  worker: {
    owner: ['Active owner', 'check'],
  },
};

function frame(id, text, x, y, width, height) {
  return [
    {
      id: `${id}-title`,
      type: 'text',
      x: x + 28,
      y: y + 18,
      width: Math.min(380, width - 56),
      height: 34,
      text,
      fontSize: 22,
      fontFamily: 1,
      strokeColor: palette.ink,
      backgroundColor: 'transparent',
    },
  ];
}

function node(id, text, kind, x, y, width = 190, height = 78) {
  const [backgroundColor, strokeColor] = palette[kind];
  return {
    id,
    type: kind === 'decision' ? 'diamond' : kind === 'entry' || kind === 'output' ? 'ellipse' : 'rectangle',
    x,
    y,
    width,
    height,
    strokeColor,
    backgroundColor,
    fillStyle: 'hachure',
    strokeWidth: 2,
    roughness: 1,
    label: {
      text: Array.isArray(text) ? text.join('\n') : text,
      fontSize: Array.isArray(text) && text.some((line) => line.length > 18) ? 17 : 19,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
    },
  };
}

function text(id, value, x, y, width = 780) {
  return {
    id,
    type: 'text',
    x,
    y,
    width,
    height: 30,
    text: value,
    fontSize: 18,
    fontFamily: 1,
    textAlign: 'center',
    strokeColor: '#5f6363',
    backgroundColor: 'transparent',
  };
}

function branchLabel(id, value, x, y, width = 110) {
  return {
    id,
    type: 'text',
    x,
    y,
    width,
    height: 24,
    text: value,
    fontSize: 16,
    fontFamily: 1,
    textAlign: 'center',
    strokeColor: '#6b6257',
    backgroundColor: 'transparent',
  };
}

function arrow(id, points, dashed = false) {
  const [start, ...rest] = points;
  const end = points[points.length - 1];
  return {
    id,
    type: 'arrow',
    x: start[0],
    y: start[1],
    width: end[0] - start[0],
    height: end[1] - start[1],
    points: points.map(([x, y]) => [x - start[0], y - start[1]]),
    strokeColor: dashed ? palette.recovery[1] : palette.ink,
    strokeStyle: dashed ? 'dashed' : 'solid',
    strokeWidth: 2,
    roughness: 1,
    endArrowhead: 'arrow',
  };
}

function makeDiagram(slug, locale, skeletons) {
  return { slug: locale === 'en' ? `${slug}-en` : slug, skeletons };
}

function approval(locale) {
  const t = locale === 'ko' ? ko.approval : en.approval;
  const l =
    locale === 'ko'
      ? { ready: '준비됨', missing: '누락', clear: '명확', unclear: '애매함' }
      : { ready: 'ready', missing: 'missing', clear: 'clear', unclear: 'unclear' };
  const arrows = [
    arrow('a1', [[204, 162], [242, 162]]),
    arrow('a2', [[414, 162], [468, 162]]),
    arrow('a3', [[654, 162], [718, 162]]),
    arrow('a4', [[930, 162], [984, 162]]),
    arrow('a4b', [[824, 216], [824, 268], [733, 268], [733, 350]], true),
    arrow('a5', [[1074, 202], [1074, 264], [180, 264], [180, 390], [318, 390]]),
    arrow('a6', [[520, 390], [624, 390]]),
    arrow('a7', [[842, 390], [1048, 390]]),
    arrow('a8', [[422, 432], [422, 586]]),
    arrow('a9', [[522, 626], [596, 626]]),
    arrow('a10', [[788, 626], [850, 626]]),
    arrow('a11', [[1062, 626], [1124, 626]]),
    arrow('a12', [[1230, 670], [1230, 700]]),
    arrow('a13', [[1340, 736], [1440, 736], [1440, 466], [1150, 466], [1150, 432]], true),
    arrow('a14', [[956, 574], [956, 518], [804, 518], [804, 466], [733, 466], [733, 432]], true),
  ];
  return makeDiagram('approval-automation', locale, [
    ...frame('creator-frame', t.creator, 40, 46, 1510, 178),
    ...frame('admin-frame', t.admin, 238, 286, 1132, 172),
    ...frame('agent-frame', t.agent, 238, 522, 1132, 220),
    ...arrows,
    node('start', t.start, 'entry', 82, 126, 118, 72),
    node('draft', ['Draft ready'], 'entry', 246, 122, 170, 80),
    node('submit', ['Submit', 'request'], 'process', 468, 122, 188, 80),
    node('gate', ['Media readiness', 'gate'], 'decision', 718, 108, 210, 108),
    node('submitted', ['Submitted', 'item'], 'process', 984, 122, 180, 80),
    node('queue', ['Admin review', 'queue'], 'process', 318, 350, 206, 80),
    node('manual', ['Manual review', 'fallback'], 'recovery', 624, 350, 218, 80),
    node('publish', ['Approved', 'publish'], 'output', 1048, 350, 194, 80),
    node('slack', ['Slack approval', 'request'], 'process', 318, 590, 206, 80),
    node('evidence', ['Evidence', 'lookup'], 'process', 596, 590, 192, 80),
    node('confidence', t.confidence, 'decision', 850, 574, 212, 112),
    node('auto', ['Autonomous', 'approval'], 'recovery', 1124, 590, 212, 80),
    node('audit', ['Audit trail'], 'output', 1124, 700, 212, 74),
    branchLabel('a4-label', l.ready, 934, 134, 72),
    branchLabel('a4b-label', l.missing, 760, 238, 86),
    branchLabel('a11-label', l.clear, 1064, 596, 72),
    branchLabel('a14-label', l.unclear, 858, 492, 90),
    text('approval-note', t.note, 424, 820),
  ]);
}

function media(locale) {
  const t = locale === 'ko' ? ko.media : en.media;
  const l =
    locale === 'ko'
      ? { ok: '확인', mismatch: '불일치', image: '이미지', video: '비디오', tag: '태그', ready: '준비됨' }
      : { ok: 'ok', mismatch: 'mismatch', image: 'image', video: 'video', tag: 'tag', ready: 'ready' };
  const arrows = [
    arrow('m1', [[230, 142], [282, 142]]),
    arrow('m2', [[502, 142], [556, 142]]),
    arrow('m3', [[754, 142], [810, 142]]),
    arrow('m4', [[914, 182], [914, 222], [212, 222], [212, 318]]),
    arrow('m5', [[308, 360], [388, 360]]),
    arrow('m6', [[582, 360], [678, 360]]),
    arrow('m7', [[486, 418], [486, 452], [1042, 452], [1042, 360], [1076, 360]], true),
    arrow('m8', [[870, 360], [870, 454], [210, 454], [210, 610]]),
    arrow('m9', [[1266, 360], [1320, 360]], true),
    arrow('m10', [[1420, 398], [1420, 452], [1190, 452], [1190, 760], [1172, 760]], true),
    arrow('m11', [[300, 652], [368, 652]]),
    arrow('m12', [[564, 652], [612, 652], [612, 566], [648, 566]]),
    arrow('m13', [[564, 652], [648, 652]]),
    arrow('m14', [[564, 652], [612, 652], [612, 748], [648, 748]]),
    arrow('m15', [[862, 566], [920, 566], [920, 660], [982, 660]]),
    arrow('m16', [[862, 660], [982, 660]]),
    arrow('m17', [[862, 748], [920, 748], [920, 660], [982, 660]]),
    arrow('m18', [[1178, 660], [1206, 660]]),
    arrow('m19', [[1396, 660], [1420, 660]]),
  ];
  return makeDiagram('media-pipeline', locale, [
    ...frame('media-frontend-frame', 'Frontend upload', 40, 40, 956, 162),
    ...frame('media-backend-frame', t.backend, 40, 248, 956, 172),
    ...frame('media-safety-frame', t.safety, 1040, 248, 514, 172),
    ...frame('media-worker-frame', t.worker, 40, 486, 1514, 312),
    ...arrows,
    node('file', t.file, 'entry', 82, 108, 148, 72),
    node('session', ['Upload session', '+ temp media'], 'process', 282, 104, 220, 80),
    node('presign', ['Presigned URL'], 'process', 556, 104, 198, 80),
    node('r2', t.upload, 'output', 810, 104, 214, 80),
    node('complete', ['Complete', 'callback'], 'process', 118, 320, 190, 80),
    node('verify', t.verify, 'decision', 388, 302, 194, 116),
    node('queue', ['Queue', 'fan-out'], 'process', 678, 320, 192, 80),
    node('mismatch', ['Mismatch', 'cleanup'], 'recovery', 1076, 320, 190, 80),
    node('status', ['Temp media', 'status'], 'recovery', 1320, 320, 190, 80),
    node('claim', ['Claim', 'with lease'], 'process', 118, 612, 182, 82),
    node('type', ['Media type', 'routing'], 'decision', 368, 596, 196, 112),
    node('tag', ['AI tagging', 'ONNX'], 'process', 648, 528, 214, 76),
    node('derivative', ['Image WebP', 'derivative'], 'process', 648, 620, 214, 76),
    node('transcode', ['Video MP4', 'transcode'], 'process', 648, 712, 214, 76),
    node('result', ['Result', 'writeback'], 'output', 982, 620, 196, 80),
    node('retry', ['Retry /', 'backfill'], 'recovery', 982, 720, 190, 78),
    node('ready', ['Storefront', 'ready'], 'output', 1206, 620, 190, 80),
    node('public', ['Public media', 'available'], 'output', 1420, 620, 140, 80),
    branchLabel('m6-label', l.ok, 596, 328, 72),
    branchLabel('m7-label', l.mismatch, 736, 426, 110),
    branchLabel('m12-label', l.tag, 574, 562, 74),
    branchLabel('m13-label', l.image, 574, 628, 84),
    branchLabel('m14-label', l.video, 574, 730, 84),
    branchLabel('m19-label', l.ready, 1390, 626, 76),
  ]);
}

function feed(locale) {
  const t = locale === 'ko' ? ko.feed : en.feed;
  const l =
    locale === 'ko'
      ? { observe: '관찰', prefetch: '미리 로드', budget: '예산 기록' }
      : { observe: 'observe', prefetch: 'prefetch', budget: 'budget' };
  const arrows = [
    arrow('f1', [[364, 230], [452, 230]]),
    arrow('f2', [[680, 230], [768, 230]]),
    arrow('f3', [[986, 230], [1080, 230]]),
    arrow('f4', [[566, 272], [566, 410], [502, 410], [502, 580]]),
    arrow('f5', [[1194, 272], [1194, 410], [804, 410], [804, 580]], true),
    arrow('f6', [[616, 622], [696, 622]]),
    arrow('f7', [[912, 622], [1000, 622]]),
  ];
  return makeDiagram('marketplace-feed', locale, [
    ...frame('feed-main-frame', t.main, 72, 88, 1456, 244),
    ...frame('feed-perf-frame', t.perf, 294, 486, 1010, 224),
    ...arrows,
    node('descriptor', ['Presentation', 'descriptor'], 'entry', 146, 188, 218, 84),
    node('packing', ['Responsive', 'row packing'], 'process', 452, 188, 228, 84),
    node('pagination', ['Offset', 'pagination'], 'process', 768, 188, 218, 84),
    node('preview', ['Preview modal', 'handoff'], 'output', 1080, 188, 228, 84),
    node('observer', ['Shared observer', 'pool'], 'process', 388, 580, 228, 84),
    node('prefetch', ['Batched', 'prefetch'], 'recovery', 696, 580, 216, 84),
    node('budget', ['Session', 'budget'], 'output', 1000, 580, 216, 84),
    branchLabel('f4-label', l.observe, 510, 418, 86),
    branchLabel('f5-label', l.prefetch, 1058, 392, 108),
    branchLabel('f7-label', l.budget, 918, 588, 94),
    text('feed-note', t.note, 412, 800),
  ]);
}

function incident(locale) {
  const t = locale === 'ko' ? ko.incident : en.incident;
  const l =
    locale === 'ko'
      ? { yes: '예', no: '아니오', known: '담당 있음', unknown: '담당 없음', enough: '충분', missing: '부족', fail: '실패' }
      : { yes: 'yes', no: 'no', known: 'owned', unknown: 'unknown', enough: 'enough', missing: 'missing', fail: 'fail' };
  const arrows = [
    arrow('i1', [[264, 168], [336, 168]]),
    arrow('i2', [[536, 168], [602, 168]]),
    arrow('i3', [[790, 168], [860, 168]]),
    arrow('i4', [[1068, 168], [1132, 168]]),
    arrow('i5', [[1314, 168], [1370, 168]]),
    arrow('i6', [[1448, 208], [1538, 208], [1538, 292], [1524, 292]], true),
    arrow('i6b', [[1224, 224], [1224, 314], [1295, 314], [1295, 396]], true),
    arrow('i7', [[966, 208], [966, 238], [820, 238], [820, 292], [860, 292]], true),
    arrow('i7b', [[696, 224], [696, 292], [860, 292]], true),
    arrow('i8', [[1524, 168], [1540, 168], [1540, 540], [436, 540], [436, 476]]),
    arrow('i9', [[530, 436], [604, 436]]),
    arrow('i10', [[804, 436], [878, 436]]),
    arrow('i11', [[1090, 436], [1170, 436]]),
    arrow('i12', [[704, 490], [704, 562], [320, 562], [320, 684], [338, 684]]),
    arrow('i13', [[542, 684], [648, 684]]),
    arrow('i14', [[852, 684], [958, 684]]),
    arrow('i15', [[1060, 646], [1060, 562], [1160, 562], [1160, 436], [1170, 436]], true),
  ];
  return makeDiagram('incident-automation', locale, [
    ...frame('incident-relay-frame', 'Incident relay', 40, 48, 1514, 192),
    ...frame('incident-agent-frame', t.agent, 294, 330, 1234, 182),
    ...frame('incident-github-frame', 'GitHub handoff', 294, 600, 1234, 154),
    ...arrows,
    node('sentry', ['Sentry issue', 'alert'], 'entry', 82, 128, 182, 80),
    node('verify', ['Signature +', 'timestamp'], 'process', 336, 128, 200, 80),
    node('scope', ['Prod error?'], 'decision', 602, 112, 188, 112),
    node('dedup', ['Replay +', 'dedup guard'], 'process', 860, 128, 208, 80),
    node('route', ['Domain', 'routing'], 'decision', 1132, 112, 182, 112),
    node('slack', t.slack, 'output', 1370, 128, 154, 80),
    node('suppress', ['Duplicate', 'suppress'], 'recovery', 860, 254, 208, 78),
    node('retry', ['Slack retry', '/backoff'], 'recovery', 1328, 254, 196, 78),
    node('ack', ['Agent ACK', 'reaction'], 'entry', 338, 396, 192, 80),
    node('evidence', t.evidence, 'decision', 604, 380, 200, 112),
    node('human', ['Human review', 'fallback'], 'recovery', 878, 396, 212, 80),
    node('review', t.review, 'output', 1170, 396, 250, 80),
    node('issue', t.issue, 'process', 338, 644, 204, 80),
    node('branch', t.branch, 'process', 648, 644, 204, 80),
    node('pr', t.pr, 'process', 958, 644, 204, 80),
    branchLabel('i3-label', l.yes, 800, 136, 64),
    branchLabel('i7b-label', l.no, 704, 250, 72),
    branchLabel('i5-label', l.known, 1320, 136, 86),
    branchLabel('i6b-label', l.unknown, 1234, 276, 92),
    branchLabel('i6-label', l.fail, 1462, 234, 70),
    branchLabel('i10-label', l.missing, 812, 402, 86),
    branchLabel('i12-label', l.enough, 564, 536, 86),
  ]);
}

function redis(locale) {
  const t = locale === 'ko' ? ko.redis : en.redis;
  const l =
    locale === 'ko'
      ? { underLimit: '한도 안', overLimit: '초과/진단' }
      : { underLimit: 'under limit', overLimit: 'over limit' };
  const arrows = [
    arrow('r1', [[314, 246], [396, 246]]),
    arrow('r2', [[616, 246], [702, 246]]),
    arrow('r3', [[914, 246], [998, 246]]),
    arrow('r4', [[1194, 246], [1282, 246]]),
    arrow('r5', [[1096, 304], [1096, 448], [500, 448], [500, 604]], true),
    arrow('r6', [[610, 644], [702, 644]]),
    arrow('r7', [[914, 644], [1000, 644]]),
  ];
  return makeDiagram('redis-traffic', locale, [
    ...frame('redis-protect-frame', t.main, 72, 104, 1456, 254),
    ...frame('redis-cost-frame', t.cost, 294, 516, 1010, 224),
    ...arrows,
    node('request', ['API request'], 'entry', 142, 206, 172, 80),
    node('bucket', ['Route bucket', 'normalize'], 'process', 396, 206, 220, 80),
    node('actor', t.actor, 'process', 702, 206, 212, 80),
    node('limit', ['Limiter', 'decision'], 'decision', 998, 188, 196, 116),
    node('response', ['HTTP', 'response'], 'output', 1282, 206, 208, 80),
    node('diagnostic', ['On-demand', 'diagnostic'], 'process', 390, 604, 220, 82),
    node('hash', ['Redis hash', 'with TTL'], 'recovery', 702, 604, 212, 82),
    node('quota', ['Quota usage', 'dashboard'], 'output', 1000, 604, 220, 82),
    branchLabel('r4-label', l.underLimit, 1204, 214, 104),
    branchLabel('r5-label', l.overLimit, 938, 416, 108),
  ]);
}

function worker(locale) {
  const t = locale === 'ko' ? ko.worker : en.worker;
  const l =
    locale === 'ko'
      ? { active: '활성', local: '로컬', media: '미디어', backup: '백업', scheduled: '스케줄', down: 'DOWN', ok: 'OK' }
      : { active: 'active', local: 'local', media: 'media', backup: 'backup', scheduled: 'scheduled', down: 'DOWN', ok: 'OK' };
  const arrows = [
    arrow('w1', [[300, 144], [384, 144]]),
    arrow('w2', [[608, 144], [702, 144]]),
    arrow('w3', [[910, 144], [1278, 144]]),
    arrow('w4', [[806, 200], [806, 226], [202, 226], [202, 382]]),
    arrow('w5', [[310, 424], [384, 424]]),
    arrow('w6', [[612, 424], [680, 424], [680, 350], [728, 350]]),
    arrow('w7', [[612, 424], [728, 440]]),
    arrow('w8', [[612, 424], [680, 424], [680, 530], [728, 530]]),
    arrow('w9', [[1008, 350], [1092, 350], [1092, 440], [1168, 440]]),
    arrow('w10', [[1008, 440], [1168, 440]]),
    arrow('w11', [[1008, 530], [1092, 530], [1092, 440], [1168, 440]]),
    arrow('w12', [[1278, 402], [1278, 224], [1386, 224], [1386, 182]], true),
    arrow('w13', [[558, 756], [626, 756]]),
    arrow('w14', [[836, 756], [908, 756]]),
    arrow('w15', [[1118, 756], [1190, 756]]),
    arrow('w16', [[1296, 718], [1296, 670]], true),
    arrow('w17', [[452, 704], [452, 680], [260, 680], [260, 570], [430, 570], [430, 486]], true),
  ];
  return makeDiagram('worker-platform', locale, [
    ...frame('worker-control-frame', 'Worker control plane', 40, 38, 1514, 160),
    ...frame('worker-local-frame', 'Local worker hub', 40, 270, 1514, 288),
    ...frame('worker-failover-frame', 'Railway sleeping backup', 300, 580, 1120, 244),
    ...arrows,
    node('heartbeat', ['Heartbeat +', 'module health'], 'entry', 88, 104, 212, 80),
    node('state', ['worker_control', '_state'], 'process', 384, 104, 224, 80),
    node('owner', t.owner, 'decision', 702, 88, 208, 112),
    node('dashboard', ['Worker Ops', 'Dashboard'], 'output', 1278, 104, 212, 80),
    node('supervisor', ['Local worker', 'Supervisor'], 'entry', 88, 384, 222, 82),
    node('modules', ['Worker modules', 'active'], 'decision', 384, 362, 228, 124),
    node('media', ['Media line', 'Tag·Derive·Transcode'], 'process', 728, 310, 280, 80),
    node('backup', ['DB backup line', 'pg_dump → R2 → verify'], 'process', 728, 400, 280, 80),
    node('scheduled', ['Scheduled ops', 'cleanup·stale·backfill'], 'process', 728, 490, 280, 80),
    node('result', ['Status + audit', 'writeback'], 'output', 1168, 400, 220, 80),
    node('down', ['Local /ready', 'DOWN'], 'decision', 348, 700, 210, 112),
    node('wake', ['Wake Railway', '/ready'], 'recovery', 626, 716, 210, 80),
    node('refresh', ['Control-plane', 'refresh'], 'process', 908, 716, 210, 80),
    node('claim', ['Backup claims', 'active jobs'], 'output', 1190, 716, 210, 80),
    node('park', ['Failback cooldown', '+ park'], 'recovery', 1190, 590, 210, 80),
    branchLabel('w3-label', l.active, 918, 112, 74),
    branchLabel('w4-label', l.local, 824, 230, 74),
    branchLabel('w6-label', l.media, 638, 348, 84),
    branchLabel('w7-label', l.backup, 638, 406, 84),
    branchLabel('w8-label', l.scheduled, 634, 528, 104),
    branchLabel('w13-label', l.down, 558, 722, 74),
    branchLabel('w17-label', l.ok, 270, 646, 72),
  ]);
}

const diagrams = [
  approval('ko'),
  approval('en'),
  media('ko'),
  media('en'),
  feed('ko'),
  feed('en'),
  incident('ko'),
  incident('en'),
  redis('ko'),
  redis('en'),
  worker('ko'),
  worker('en'),
];

async function waitForChrome(port) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) {
        return page.webSocketDebuggerUrl;
      }
    } catch {
      // keep waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Chrome DevTools endpoint did not start.');
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createNetServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === 'object') {
          resolve(address.port);
        } else {
          reject(new Error('Could not allocate a local port.'));
        }
      });
    });
  });
}

function createCdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) {
      return;
    }

    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);

    if (message.error) {
      reject(new Error(JSON.stringify(message.error)));
    } else {
      resolve(message.result);
    }
  });

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  return {
    ready,
    close: () => ws.close(),
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
  };
}

async function main() {
  const vite = await createServer({
    root: process.cwd(),
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0 },
  });
  await vite.listen();
  const baseUrl = vite.resolvedUrls.local[0];
  const chromePort = await findFreePort();
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${chromePort}`,
    '--window-size=1600,920',
    `--user-data-dir=/tmp/portfolio-excalidraw-export-${Date.now()}`,
    'about:blank',
  ]);

  try {
    const client = createCdpClient(await waitForChrome(chromePort));
    await client.ready;
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Page.navigate', { url: `${baseUrl}scripts/excalidraw-exporter.html` });

    const readyResult = await client.send('Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const started = Date.now();
        function check() {
          if (window.__projectDiagramExporterReady) resolve(true);
          else if (Date.now() - started > 10000) resolve(false);
          else setTimeout(check, 50);
        }
        check();
      })`,
      awaitPromise: true,
      returnByValue: true,
    });

    if (!readyResult.result.value) {
      throw new Error('Excalidraw diagram exporter did not become ready.');
    }

    for (const diagram of diagrams) {
      if (!diagram.slug.endsWith('-en')) {
        const sceneResult = await client.send('Runtime.evaluate', {
          expression: `window.exportProjectDiagramScene(${JSON.stringify(diagram.skeletons)})`,
          awaitPromise: true,
          returnByValue: true,
        });

        if (sceneResult.exceptionDetails) {
          throw new Error(JSON.stringify(sceneResult.exceptionDetails));
        }

        const scenePath = join(editableOutputDir, `${diagram.slug}.excalidraw`);
        if (shouldOverwriteEditableDiagrams || !existsSync(scenePath)) {
          writeFileSync(scenePath, sceneResult.result.value);
          console.log(`wrote ${scenePath}`);
        } else {
          console.log(`skipped existing editable ${scenePath}`);
        }
      } else {
        console.log(`skipped editable source for ${diagram.slug}`);
      }

      const result = await client.send('Runtime.evaluate', {
        expression: `window.renderProjectDiagram(${JSON.stringify(diagram.skeletons)})`,
        awaitPromise: true,
        returnByValue: true,
      });

      if (result.exceptionDetails) {
        throw new Error(JSON.stringify(result.exceptionDetails));
      }

      const pngPath = join(outputDir, `${diagram.slug}.png`);
      writeFileSync(pngPath, Buffer.from(result.result.value, 'base64'));
      console.log(`wrote ${pngPath}`);
    }

    client.close();
  } finally {
    chrome.kill('SIGTERM');
    await vite.close();
  }
}

await main();
