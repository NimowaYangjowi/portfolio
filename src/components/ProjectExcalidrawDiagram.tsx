import approvalAutomationImage from '../assets/project-diagrams/approval-automation.png';
import approvalAutomationImageEn from '../assets/project-diagrams/approval-automation-en.png';
import incidentAutomationImage from '../assets/project-diagrams/incident-automation.png';
import incidentAutomationImageEn from '../assets/project-diagrams/incident-automation-en.png';
import marketplaceFeedImage from '../assets/project-diagrams/marketplace-feed.png';
import marketplaceFeedImageEn from '../assets/project-diagrams/marketplace-feed-en.png';
import mediaPipelineImage from '../assets/project-diagrams/media-pipeline.png';
import mediaPipelineImageEn from '../assets/project-diagrams/media-pipeline-en.png';
import redisTrafficImage from '../assets/project-diagrams/redis-traffic.png';
import redisTrafficImageEn from '../assets/project-diagrams/redis-traffic-en.png';
import workerPlatformImage from '../assets/project-diagrams/worker-platform.png';
import workerPlatformImageEn from '../assets/project-diagrams/worker-platform-en.png';

type ProjectFlowStep = {
  title: string;
  kind: 'entry' | 'process' | 'decision' | 'recovery' | 'output';
};

type DiagramVariant =
  | 'approvalAutomation'
  | 'mediaPipeline'
  | 'marketplaceFeed'
  | 'incidentAutomation'
  | 'redisTraffic'
  | 'workerPlatform';

type ProjectExcalidrawDiagramProps = {
  diagramVariant?: DiagramVariant;
  language?: 'ko' | 'en';
  mermaidDefinition?: string;
  mainFlowLabel: string;
  recoveryFlowLabel: string;
  edgeLabels?: {
    ready: string;
    blocked: string;
    continue: string;
  };
  steps: ProjectFlowStep[];
  recoverySteps: ProjectFlowStep[];
};

const diagramImages: Record<DiagramVariant, { ko: string; en: string }> = {
  approvalAutomation: { ko: approvalAutomationImage, en: approvalAutomationImageEn },
  mediaPipeline: { ko: mediaPipelineImage, en: mediaPipelineImageEn },
  marketplaceFeed: { ko: marketplaceFeedImage, en: marketplaceFeedImageEn },
  incidentAutomation: { ko: incidentAutomationImage, en: incidentAutomationImageEn },
  redisTraffic: { ko: redisTrafficImage, en: redisTrafficImageEn },
  workerPlatform: { ko: workerPlatformImage, en: workerPlatformImageEn },
};

function inferDiagramVariant(mainFlowLabel: string): DiagramVariant {
  if (mainFlowLabel.includes('미디어') || mainFlowLabel.includes('media')) {
    return 'mediaPipeline';
  }

  if (mainFlowLabel.includes('탐색') || mainFlowLabel.includes('Feed')) {
    return 'marketplaceFeed';
  }

  if (mainFlowLabel.includes('Incident') || mainFlowLabel.includes('장애')) {
    return 'incidentAutomation';
  }

  if (mainFlowLabel.includes('요청') || mainFlowLabel.includes('Request')) {
    return 'redisTraffic';
  }

  if (mainFlowLabel.includes('Worker')) {
    return 'workerPlatform';
  }

  return 'approvalAutomation';
}

export default function ProjectExcalidrawDiagram({
  diagramVariant,
  language = 'ko',
  mainFlowLabel,
}: ProjectExcalidrawDiagramProps) {
  const variant = diagramVariant ?? inferDiagramVariant(mainFlowLabel);
  const imageSrc = diagramImages[variant][language];

  return (
    <div
      className={`project-excalidraw-canvas project-excalidraw-canvas-${variant}`}
      aria-label={language === 'ko' ? '구현 흐름도' : 'Implementation flowchart'}
    >
      <img
        src={imageSrc}
        alt={language === 'ko' ? `${mainFlowLabel} 다이어그램` : `${mainFlowLabel} diagram`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
