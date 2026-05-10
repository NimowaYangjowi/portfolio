import { useEffect, useMemo, useState } from 'react';
import { convertToExcalidrawElements, exportToSvg } from '@excalidraw/excalidraw';
import type { ExcalidrawElementSkeleton } from '@excalidraw/excalidraw/data/transform';

type DiagramState =
  | { status: 'loading' }
  | { status: 'ready'; svgUrl: string }
  | { status: 'error' };

type StakeholderNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  strokeColor: string;
};

type CommunicationEdge = {
  start: readonly [number, number];
  end: readonly [number, number];
  label: string;
  bend: number;
  primary?: boolean;
};

type LocalPoint = [x: number, y: number] & {
  _brand: 'excalimath__localpoint';
};

const stakeholderNodes: StakeholderNode[] = [
  {
    id: 'client',
    label: 'Client',
    x: 38,
    y: 64,
    width: 132,
    height: 62,
    backgroundColor: '#eff8ff',
    strokeColor: '#77bef0',
  },
  {
    id: 'product',
    label: 'Product',
    x: 304,
    y: 18,
    width: 148,
    height: 64,
    backgroundColor: '#fff0c9',
    strokeColor: '#ffcb61',
  },
  {
    id: 'partner',
    label: 'Partner',
    x: 564,
    y: 78,
    width: 138,
    height: 62,
    backgroundColor: '#fff1e7',
    strokeColor: '#ff894f',
  },
  {
    id: 'agency',
    label: 'Agency',
    x: 70,
    y: 330,
    width: 140,
    height: 62,
    backgroundColor: '#fff8dc',
    strokeColor: '#d8b84e',
  },
  {
    id: 'dev',
    label: 'Dev',
    x: 548,
    y: 318,
    width: 132,
    height: 62,
    backgroundColor: '#e8f4ef',
    strokeColor: '#1a3a3a',
  },
  {
    id: 'sales',
    label: 'Sales',
    x: 610,
    y: 204,
    width: 104,
    height: 58,
    backgroundColor: '#ffeef2',
    strokeColor: '#ea5b6f',
  },
];

const edges: readonly CommunicationEdge[] = [
  { start: [318, 226], end: [170, 95], label: 'scope', bend: -34, primary: true },
  { start: [384, 184], end: [378, 82], label: 'feedback', bend: 22, primary: true },
  { start: [450, 226], end: [564, 109], label: 'align', bend: 36, primary: true },
  { start: [450, 246], end: [548, 349], label: 'handoff', bend: -26, primary: true },
  { start: [318, 244], end: [210, 361], label: 'launch', bend: 22, primary: true },
  { start: [450, 228], end: [610, 233], label: 'deal', bend: -18, primary: true },
  { start: [170, 95], end: [304, 50], label: 'needs', bend: -18 },
  { start: [452, 50], end: [564, 109], label: 'roadmap', bend: 16 },
  { start: [633, 140], end: [614, 318], label: 'API', bend: -30 },
  { start: [548, 349], end: [210, 361], label: 'QA', bend: 42 },
  { start: [70, 361], end: [104, 126], label: 'launch', bend: -34 },
  { start: [170, 95], end: [450, 246], label: 'blocker', bend: 46 },
  { start: [318, 226], end: [548, 349], label: 'issue', bend: 58 },
  { start: [210, 361], end: [564, 109], label: 'asset', bend: -64 },
  { start: [170, 95], end: [548, 349], label: 'debug', bend: 70 },
  { start: [378, 82], end: [140, 330], label: 'brief', bend: -56 },
  { start: [610, 233], end: [170, 95], label: 'expectation', bend: -70 },
] as const;

function localPoint(x: number, y: number): LocalPoint {
  return [x, y] as LocalPoint;
}

function createStakeholderNode(node: StakeholderNode): ExcalidrawElementSkeleton {
  return {
    id: node.id,
    type: 'rectangle',
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    strokeColor: node.strokeColor,
    backgroundColor: node.backgroundColor,
    fillStyle: 'solid',
    roughness: 2,
    roundness: { type: 3 },
    label: {
      text: node.label,
      fontSize: 20,
      textAlign: 'center',
      verticalAlign: 'middle',
      strokeColor: '#1a3a3a',
    },
  };
}

function createEdge(index: number, edge: CommunicationEdge): ExcalidrawElementSkeleton {
  const [startX, startY] = edge.start;
  const [endX, endY] = edge.end;
  const controlX = (endX - startX) * 0.48;
  const controlY = (endY - startY) * 0.52 + edge.bend;

  return {
    id: `edge-${index}`,
    type: 'arrow',
    x: startX,
    y: startY,
    points: [
      localPoint(0, 0),
      localPoint(controlX, controlY),
      localPoint(endX - startX, endY - startY),
    ],
    strokeColor: edge.primary ? '#1a3a3a' : '#8c8071',
    strokeStyle: edge.primary ? 'solid' : index % 2 === 0 ? 'dashed' : 'dotted',
    strokeWidth: edge.primary ? 2 : 1,
    roughness: 2,
    startArrowhead: index % 3 === 0 ? 'dot' : undefined,
    endArrowhead: 'triangle',
    label: {
      text: edge.label,
      fontSize: 13,
      textAlign: 'center',
      verticalAlign: 'middle',
      strokeColor: '#5d5247',
    },
  };
}

function buildTechnicalCommunicationElements() {
  const elements: ExcalidrawElementSkeleton[] = [
    ...edges.map((edge, index) => createEdge(index, edge)),
    {
      id: 'canvas-note',
      type: 'text',
      x: 262,
      y: 404,
      width: 230,
      height: 28,
      text: 'technical communication map',
      fontSize: 17,
      textAlign: 'center',
      strokeColor: '#6a6259',
      backgroundColor: 'transparent',
      opacity: 72,
    },
    ...stakeholderNodes.map(createStakeholderNode),
    {
      id: 'me',
      type: 'ellipse',
      x: 318,
      y: 184,
      width: 132,
      height: 88,
      strokeColor: '#ea5b6f',
      backgroundColor: '#fffaf0',
      fillStyle: 'hachure',
      roughness: 2,
      strokeWidth: 3,
      label: {
        text: 'Me\nJiwoo',
        fontSize: 22,
        textAlign: 'center',
        verticalAlign: 'middle',
        strokeColor: '#0a0a0a',
      },
    },
  ];

  return convertToExcalidrawElements(elements, { regenerateIds: false });
}

export default function TechnicalCommunicationExcalidrawDiagram() {
  const [diagram, setDiagram] = useState<DiagramState>({ status: 'loading' });
  const elements = useMemo(() => buildTechnicalCommunicationElements(), []);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    setDiagram({ status: 'loading' });

    exportToSvg({
      elements,
      files: {},
      exportPadding: 26,
      appState: {
        exportBackground: true,
        exportWithDarkMode: false,
        viewBackgroundColor: '#fffaf0',
      },
    })
      .then((svgElement: SVGSVGElement) => {
        const svg = new XMLSerializer().serializeToString(svgElement);
        objectUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setDiagram({ status: 'ready', svgUrl: objectUrl });
      })
      .catch(() => {
        if (!cancelled) {
          setDiagram({ status: 'error' });
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [elements]);

  if (diagram.status === 'loading') {
    return <div className="technical-communication-state">Drawing diagram...</div>;
  }

  if (diagram.status === 'error') {
    return <div className="technical-communication-state">Diagram could not be loaded.</div>;
  }

  return (
    <div className="technical-communication-diagram" aria-label="Technical communication stakeholder diagram">
      <img src={diagram.svgUrl} alt="" />
    </div>
  );
}
