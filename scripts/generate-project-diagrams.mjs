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
    note: '화면 폭이 바뀌어도 같은 상품 순서와 prefetch 허용량을 유지',
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
    routing: ['작업 유형', '분기'],
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
    note: 'Preserves item order and preview prefetch allowance across viewport changes',
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
    routing: ['Job type', 'routing'],
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
      ? { ready: '검토 가능', missing: '보완 필요', resubmit: '재제출', clear: '근거 충분', unclear: '애매함', approve: '승인', return: '수정 요청' }
      : { ready: 'ready', missing: 'needs changes', resubmit: 'resubmit', clear: 'enough', unclear: 'ambiguous', approve: 'approve', return: 'return' };
  const arrows = [
    arrow('a1', [[244, 150], [300, 150]]),
    arrow('a2', [[500, 150], [560, 150]]),
    arrow('a3', [[760, 150], [830, 150]]),
    arrow('a4', [[650, 208], [650, 264], [520, 264]], true),
    arrow('a4b', [[300, 264], [250, 264], [250, 150], [300, 150]], true),
    arrow('a5', [[1040, 150], [1110, 150]]),
    arrow('a6', [[1310, 150], [1370, 150]]),
    arrow('a7', [[1470, 190], [1470, 318], [176, 318], [176, 382]]),
    arrow('a8', [[376, 422], [446, 422]]),
    arrow('a9', [[646, 422], [716, 422]]),
    arrow('a10', [[916, 422], [986, 422]]),
    arrow('a11', [[820, 480], [820, 536], [900, 536]], true),
    arrow('a12', [[1186, 422], [1260, 422]]),
    arrow('a13', [[1100, 536], [1160, 566]]),
    arrow('a14', [[1460, 422], [1490, 422], [1490, 526]]),
    arrow('a15', [[1260, 622], [1260, 692], [410, 692], [410, 304]], true),
    arrow('a16', [[1360, 566], [1400, 566]]),
  ];
  return makeDiagram('approval-automation', locale, [
    ...frame('creator-frame', t.creator, 40, 46, 1510, 204),
    ...frame('agent-frame', t.agent, 72, 330, 1460, 148),
    ...frame('admin-frame', t.admin, 72, 504, 1460, 140),
    ...arrows,
    node('draft', ['Draft', 'ready'], 'entry', 82, 110, 162, 80),
    node('submit', ['Submit', 'request'], 'process', 300, 110, 200, 80),
    node('gate', ['Validation +', 'media readiness'], 'decision', 560, 92, 200, 116),
    node('revision', ['Creator', 'revision'], 'recovery', 300, 226, 220, 78),
    node('queue', ['Admin review', 'queue'], 'process', 830, 110, 210, 80),
    node('slack', ['Slack approval', 'request'], 'process', 1110, 110, 200, 80),
    node('evidence', ['Evidence', 'lookup'], 'process', 1370, 110, 200, 80),
    node('confidence', t.confidence, 'decision', 716, 366, 200, 112),
    node('auto', ['Autonomous', 'approval'], 'process', 986, 382, 200, 80),
    node('audit-agent', ['Audit trail'], 'process', 1260, 382, 200, 80),
    node('manual', ['Manual', 'review'], 'recovery', 900, 496, 200, 80),
    node('manual-decision', ['Approve or', 'return?'], 'decision', 1160, 510, 200, 112),
    node('publish', ['Approved', 'publish'], 'output', 1420, 526, 160, 80),
    node('agent-start', ['Agent', 'check'], 'process', 176, 382, 200, 80),
    node('agent-evidence', ['Evidence', 'policy check'], 'process', 446, 382, 200, 80),
    branchLabel('a3-label', l.ready, 766, 118, 92),
    branchLabel('a4-label', l.missing, 524, 238, 118),
    branchLabel('a4b-label', l.resubmit, 216, 206, 104),
    branchLabel('a10-label', l.clear, 918, 390, 104),
    branchLabel('a11-label', l.unclear, 820, 506, 100),
    branchLabel('a13-label', l.approve, 1188, 504, 90),
    branchLabel('a15-label', l.return, 888, 660, 126),
    text('approval-note', t.note, 424, 820),
  ]);
}

function media(locale) {
  const t = locale === 'ko' ? ko.media : en.media;
  const l =
    locale === 'ko'
      ? { ok: '검증됨', mismatch: '불일치', image: '이미지', video: '비디오', tag: '태그', ready: '준비됨', failed: '실패' }
      : { ok: 'verified', mismatch: 'mismatch', image: 'image', video: 'video', tag: 'tag', ready: 'ready', failed: 'failed' };
  const arrows = [
    arrow('m1', [[230, 142], [282, 142]]),
    arrow('m2', [[502, 142], [556, 142]]),
    arrow('m3', [[754, 142], [810, 142]]),
    arrow('m4', [[914, 182], [914, 222], [212, 222], [212, 318]]),
    arrow('m5', [[308, 360], [388, 360]]),
    arrow('m6', [[582, 360], [678, 360]]),
    arrow('m7', [[486, 418], [486, 452], [1042, 452], [1042, 338], [1076, 338]], true),
    arrow('m7b', [[1266, 338], [1320, 338]], true),
    arrow('m7c', [[1415, 298], [1415, 40], [36, 40], [36, 142], [82, 142]], true),
    arrow('m8', [[870, 360], [870, 454], [210, 454], [210, 610]]),
    arrow('m11', [[300, 652], [368, 652]]),
    arrow('m12', [[564, 652], [612, 652], [612, 566], [648, 566]]),
    arrow('m13', [[564, 652], [648, 652]]),
    arrow('m14', [[564, 652], [612, 652], [612, 748], [648, 748]]),
    arrow('m15', [[862, 566], [920, 566], [920, 660], [982, 660]]),
    arrow('m16', [[862, 660], [982, 660]]),
    arrow('m17', [[862, 748], [920, 748], [920, 660], [982, 660]]),
    arrow('m18', [[1178, 660], [1206, 660]]),
    arrow('m19', [[1396, 660], [1420, 660]]),
    arrow('m20', [[1302, 700], [1302, 738]], true),
    arrow('m21', [[1077, 798], [1077, 836], [210, 836], [210, 694]], true),
    arrow('m22', [[1206, 777], [1172, 760]], true),
  ];
  return makeDiagram('media-pipeline', locale, [
    ...frame('media-frontend-frame', 'Frontend upload', 40, 40, 956, 162),
    ...frame('media-backend-frame', t.backend, 40, 248, 956, 172),
    ...frame('media-safety-frame', t.safety, 1040, 248, 514, 172),
    ...frame('media-worker-frame', t.worker, 40, 486, 1514, 360),
    ...arrows,
    node('file', t.file, 'entry', 82, 108, 148, 72),
    node('session', ['Upload session', '+ temp media'], 'process', 282, 104, 220, 80),
    node('presign', ['Presigned URL'], 'process', 556, 104, 198, 80),
    node('r2', t.upload, 'process', 810, 104, 214, 80),
    node('complete', ['Complete', 'callback'], 'process', 118, 320, 190, 80),
    node('verify', t.verify, 'decision', 388, 302, 194, 116),
    node('queue', ['Queue', 'fan-out'], 'process', 678, 320, 192, 80),
    node('mismatch', ['Mismatch', 'cleanup'], 'recovery', 1076, 298, 190, 80),
    node('upload-retry', ['User retry', 'upload'], 'recovery', 1320, 298, 190, 80),
    node('claim', ['Claim', 'with lease'], 'process', 118, 612, 182, 82),
    node('type', ['Media type', 'routing'], 'decision', 368, 596, 196, 112),
    node('tag', ['AI tagging', 'ONNX'], 'process', 648, 528, 214, 76),
    node('derivative', ['Image WebP', 'derivative'], 'process', 648, 620, 214, 76),
    node('transcode', ['Video MP4', 'transcode'], 'process', 648, 712, 214, 76),
    node('result', ['Result', 'writeback'], 'process', 982, 620, 196, 80),
    node('retry', ['Retry /', 'backfill'], 'recovery', 982, 720, 190, 78),
    node('ready', ['Storefront', 'readiness'], 'decision', 1206, 604, 190, 112),
    node('public', ['Public media', 'available'], 'output', 1420, 620, 140, 80),
    node('status', ['Temp media', 'status'], 'process', 1206, 738, 190, 78),
    branchLabel('m6-label', l.ok, 596, 328, 72),
    branchLabel('m7-label', l.mismatch, 736, 426, 110),
    branchLabel('m7b-label', l.mismatch, 1266, 304, 110),
    branchLabel('m12-label', l.tag, 574, 562, 74),
    branchLabel('m13-label', l.image, 574, 628, 84),
    branchLabel('m14-label', l.video, 574, 730, 84),
    branchLabel('m19-label', l.ready, 1390, 626, 76),
    branchLabel('m20-label', l.failed, 1302, 704, 76),
  ]);
}

function feed(locale) {
  const t = locale === 'ko' ? ko.feed : en.feed;
  const l =
    locale === 'ko'
      ? { observe: '관찰', allowed: '허용량 남음', exhausted: '허용량 소진', prefetched: 'prefetch 완료', ondemand: '즉시 요청' }
      : { observe: 'observe', allowed: 'allowance left', exhausted: 'allowance spent', prefetched: 'prefetched', ondemand: 'on demand' };
  const arrows = [
    arrow('f1', [[258, 230], [316, 230]]),
    arrow('f2', [[536, 230], [596, 230]]),
    arrow('f3', [[816, 230], [876, 230]]),
    arrow('f4', [[1096, 230], [1156, 230]]),
    arrow('f5', [[1376, 230], [1440, 230]]),
    arrow('f6', [[1266, 272], [1266, 410], [458, 410], [458, 580]], true),
    arrow('f7', [[572, 622], [642, 622]]),
    arrow('f8', [[842, 622], [912, 622]]),
    arrow('f9', [[742, 678], [742, 744], [912, 744]]),
    arrow('f10', [[1020, 580], [1020, 454], [1515, 454], [1515, 272]], true),
    arrow('f11', [[1128, 744], [1515, 744], [1515, 272]], true),
  ];
  return makeDiagram('marketplace-feed', locale, [
    ...frame('feed-main-frame', t.main, 72, 88, 1456, 244),
    ...frame('feed-perf-frame', t.perf, 294, 486, 1010, 300),
    ...arrows,
    node('fetch', ['Initial / scroll', 'fetch'], 'entry', 96, 188, 162, 84),
    node('offset', ['Offset', 'state'], 'process', 316, 188, 220, 84),
    node('descriptor', ['Presentation', 'descriptor'], 'process', 596, 188, 220, 84),
    node('packing', ['Responsive', 'row packing'], 'process', 876, 188, 220, 84),
    node('wall', ['Render card', 'wall'], 'output', 1156, 188, 220, 84),
    node('preview', ['Preview modal', 'handoff'], 'output', 1440, 188, 150, 84),
    node('observer', ['Shared observer', 'or hover'], 'process', 344, 580, 228, 84),
    node('allowance', locale === 'ko' ? ['prefetch', '허용량', '확인'] : ['Prefetch', 'allowance', 'check'], 'decision', 642, 566, 200, 112),
    node('prefetch', ['Batched', 'prefetch'], 'process', 912, 580, 216, 84),
    node('ondemand', ['On-demand', 'only'], 'process', 912, 704, 216, 84),
    branchLabel('f6-label', l.observe, 560, 418, 86),
    branchLabel('f8-label', l.allowed, 846, 590, 104),
    branchLabel('f9-label', l.exhausted, 608, 710, 112),
    branchLabel('f10-label', l.prefetched, 1040, 430, 112),
    branchLabel('f11-label', l.ondemand, 1160, 716, 112),
    text('feed-note', t.note, 412, 840),
  ]);
}

function incident(locale) {
  const t = locale === 'ko' ? ko.incident : en.incident;
  const l =
    locale === 'ko'
      ? { yes: '대상', no: '제외', unique: '신규', duplicate: '중복', routed: '라우팅', enough: '충분', missing: '부족', fail: '실패' }
      : { yes: 'in scope', no: 'ignore', unique: 'new', duplicate: 'duplicate', routed: 'routed', enough: 'enough', missing: 'missing', fail: 'fail' };
  const arrows = [
    arrow('i1', [[264, 168], [336, 168]]),
    arrow('i2', [[536, 168], [602, 168]]),
    arrow('i3', [[790, 168], [860, 168]]),
    arrow('i4', [[1068, 168], [1132, 168]]),
    arrow('i5', [[1314, 168], [1370, 168]]),
    arrow('i6', [[696, 224], [696, 284], [604, 284]], true),
    arrow('i7', [[966, 208], [966, 254]], true),
    arrow('i8', [[1448, 208], [1448, 254]], true),
    arrow('i8b', [[1328, 294], [1250, 294], [1250, 168], [1370, 168]], true),
    arrow('i8c', [[1524, 168], [1540, 168], [1540, 540], [436, 540], [436, 476]]),
    arrow('i9', [[530, 436], [604, 436]]),
    arrow('i10', [[804, 436], [878, 436]]),
    arrow('i11', [[1090, 436], [1170, 436]]),
    arrow('i12', [[704, 490], [704, 562], [320, 562], [320, 684], [338, 684]]),
    arrow('i13', [[542, 684], [648, 684]]),
    arrow('i14', [[852, 684], [958, 684]]),
    arrow('i15', [[1162, 684], [1295, 684], [1295, 478]], true),
  ];
  return makeDiagram('incident-automation', locale, [
    ...frame('incident-relay-frame', 'Incident relay', 40, 48, 1514, 192),
    ...frame('incident-agent-frame', t.agent, 294, 330, 1234, 182),
    ...frame('incident-github-frame', 'GitHub handoff', 294, 600, 1234, 154),
    ...arrows,
    node('sentry', ['Sentry issue', 'alert'], 'entry', 82, 128, 182, 80),
    node('verify', ['Signature +', 'timestamp'], 'process', 336, 128, 200, 80),
    node('scope', ['Prod error?'], 'decision', 602, 112, 188, 112),
    node('dedup', ['Replay +', 'dedup guard'], 'decision', 860, 112, 208, 112),
    node('route', ['Domain', 'routing'], 'process', 1132, 128, 182, 80),
    node('slack', t.slack, 'process', 1370, 128, 154, 80),
    node('ignore', ['Out of scope', 'ignore'], 'output', 424, 254, 180, 76),
    node('suppress', ['Duplicate', 'suppress'], 'output', 860, 254, 208, 78),
    node('retry', ['Slack retry', '/backoff'], 'recovery', 1328, 254, 196, 78),
    node('ack', ['Agent ACK', 'reaction'], 'process', 338, 396, 192, 80),
    node('evidence', t.evidence, 'decision', 604, 380, 200, 112),
    node('human', ['Human review', 'fallback'], 'recovery', 878, 396, 212, 80),
    node('review', t.review, 'output', 1170, 396, 250, 80),
    node('issue', t.issue, 'process', 338, 644, 204, 80),
    node('branch', t.branch, 'process', 648, 644, 204, 80),
    node('pr', t.pr, 'process', 958, 644, 204, 80),
    branchLabel('i3-label', l.yes, 800, 136, 82),
    branchLabel('i6-label', l.no, 610, 250, 86),
    branchLabel('i4-label', l.unique, 1072, 136, 72),
    branchLabel('i7-label', l.duplicate, 1072, 258, 92),
    branchLabel('i5-label', l.routed, 1320, 136, 86),
    branchLabel('i8-label', l.fail, 1462, 234, 70),
    branchLabel('i10-label', l.missing, 812, 402, 86),
    branchLabel('i12-label', l.enough, 564, 536, 86),
  ]);
}

function redis(locale) {
  const t = locale === 'ko' ? ko.redis : en.redis;
  const l =
    locale === 'ko'
      ? { protected: '보호', excluded: '제외', allowed: '허용', blocked: '차단', active: '진단 켬', inactive: '진단 끔' }
      : { protected: 'protected', excluded: 'excluded', allowed: 'allowed', blocked: 'blocked', active: 'diagnostic on', inactive: 'diagnostic off' };
  const arrows = [
    arrow('r1', [[314, 246], [386, 246]]),
    arrow('r2', [[586, 246], [654, 246]]),
    arrow('r3', [[850, 246], [916, 246]]),
    arrow('r4', [[1112, 246], [1190, 246]]),
    arrow('r5', [[486, 206], [486, 156], [1285, 156], [1285, 206]], true),
    arrow('r6', [[1014, 304], [1014, 384], [1190, 384]], true),
    arrow('r6b', [[1014, 304], [1014, 512], [500, 512], [500, 604]], true),
    arrow('r7', [[610, 644], [702, 644]]),
    arrow('r8', [[914, 644], [1000, 644]]),
    arrow('r9', [[500, 700], [500, 760], [702, 760]]),
  ];
  return makeDiagram('redis-traffic', locale, [
    ...frame('redis-protect-frame', t.main, 72, 104, 1456, 254),
    ...frame('redis-cost-frame', t.cost, 294, 516, 1010, 320),
    ...arrows,
    node('request', ['API request'], 'entry', 142, 206, 172, 80),
    node('bucket', ['Route bucket', '+ policy'], 'decision', 386, 188, 200, 116),
    node('actor', t.actor, 'process', 654, 206, 196, 80),
    node('limit', ['Limiter', 'decision'], 'decision', 916, 188, 196, 116),
    node('allowed', ['Handler', 'response'], 'output', 1190, 206, 190, 80),
    node('blocked', ['429 rate-limit', 'response'], 'output', 1190, 344, 190, 80),
    node('diagnostic', ['Diagnostic', 'session active?'], 'decision', 390, 588, 220, 112),
    node('hash', ['Redis hash', 'with TTL'], 'process', 702, 604, 212, 82),
    node('quota', ['Quota usage', 'dashboard'], 'output', 1000, 604, 220, 82),
    node('skip-diagnostic', ['No diagnostic', 'write'], 'output', 702, 720, 212, 82),
    branchLabel('r2-label', l.protected, 592, 214, 92),
    branchLabel('r5-label', l.excluded, 832, 126, 92),
    branchLabel('r4-label', l.allowed, 1118, 214, 92),
    branchLabel('r6-label', l.blocked, 1016, 414, 92),
    branchLabel('r7-label', l.active, 612, 610, 120),
    branchLabel('r9-label', l.inactive, 520, 772, 120),
  ]);
}

function worker(locale) {
  const t = locale === 'ko' ? ko.worker : en.worker;
  const l =
    locale === 'ko'
      ? {
          active: '활성',
          local: '로컬 정상',
          media: '미디어',
          backup: '백업',
          scheduled: '스케줄',
          eligible: '가능',
          ineligible: '불가',
          ok: '복구됨',
        }
      : {
          active: 'active',
          local: 'local healthy',
          media: 'media',
          backup: 'backup',
          scheduled: 'scheduled',
          eligible: 'eligible',
          ineligible: 'not eligible',
          ok: 'recovered',
        };
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
    arrow('w12', [[806, 200], [806, 244], [320, 244], [320, 700], [453, 700]], true),
    arrow('w13', [[558, 756], [626, 756]]),
    arrow('w13b', [[520, 716], [626, 646]], true),
    arrow('w14', [[836, 756], [908, 756]]),
    arrow('w15', [[1118, 756], [1190, 756]]),
    arrow('w16', [[1296, 718], [1296, 670]], true),
    arrow('w17', [[1190, 670], [1140, 670], [1140, 884], [620, 884], [620, 424], [612, 424]], true),
    arrow('w18', [[1400, 756], [1530, 756], [1530, 144], [1490, 144]], true),
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
    node('modules', t.routing, 'decision', 384, 362, 228, 124),
    node('media', ['Media line', 'Tag·Derive·Transcode'], 'process', 728, 310, 280, 80),
    node('backup', ['DB backup line', 'pg_dump → R2 → verify'], 'process', 728, 400, 280, 80),
    node('scheduled', ['Scheduled ops', 'cleanup·stale·backfill'], 'process', 728, 490, 280, 80),
    node('result', ['Status + audit', 'writeback'], 'output', 1168, 400, 220, 80),
    node('down', ['Failover', 'eligibility'], 'decision', 348, 700, 210, 112),
    node('nohandoff', ['No handoff', 'monitor'], 'output', 626, 606, 210, 80),
    node('wake', ['Wake Railway', '/ready'], 'recovery', 626, 716, 210, 80),
    node('refresh', ['Control-plane', 'refresh'], 'process', 908, 716, 210, 80),
    node('claim', ['Railway owner', 'claims jobs'], 'process', 1190, 716, 210, 80),
    node('park', ['Failback cooldown', '+ park'], 'recovery', 1190, 590, 210, 80),
    branchLabel('w3-label', l.active, 918, 112, 74),
    branchLabel('w4-label', l.local, 824, 258, 130),
    branchLabel('w6-label', l.media, 638, 348, 84),
    branchLabel('w7-label', l.backup, 638, 406, 84),
    branchLabel('w8-label', l.scheduled, 634, 528, 104),
    branchLabel('w13-label', l.eligible, 558, 722, 82),
    branchLabel('w13b-label', l.ineligible, 536, 644, 110),
    branchLabel('w17-label', l.ok, 1126, 842, 72),
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
