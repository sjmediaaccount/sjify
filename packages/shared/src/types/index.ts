import {
  RunStatus,
  RunOrigin,
  ActorVisibility,
  BuildStatus,
  PricingModel,
  PlanTier,
  OrgRole,
  WebhookEvent,
} from '../constants/index.js';

export interface UserSummary {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  planTier: PlanTier;
  role: OrgRole;
  monthlySpendingLimitUsd: number;
  currentMonthSpendUsd: number;
  isHardLimitReached: boolean;
  nextBillingDate: string | null;
}

export interface ActorSummary {
  id: string;
  name: string;
  slug: string;
  username: string;
  description: string;
  visibility: ActorVisibility;
  pricingModel: PricingModel;
  priceUsd: number;
  ratingAvg: number;
  ratingCount: number;
  statsRunsTotal: number;
  statsUsersTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActorDetail extends ActorSummary {
  readmeMarkdown: string;
  defaultMemoryMbytes: number;
  defaultTimeoutSecs: number;
  restartPolicy: string;
  currentVersion?: ActorVersionDetail;
}

export interface ActorVersionDetail {
  id: string;
  actorId: string;
  versionTag: string;
  sourceType: string;
  dockerfileContent: string;
  actorJson: Record<string, unknown>;
  inputSchemaJson: Record<string, unknown>;
  createdAt: string;
}

export interface ActorRunSummary {
  id: string;
  actorId: string;
  actorName?: string;
  taskId: string | null;
  taskName?: string | null;
  status: RunStatus;
  origin: RunOrigin;
  allocatedMemoryMbytes: number;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number;
  chargedUsageUsd: number;
  resultsCount: number;
  statusMessage: string | null;
  defaultDatasetId: string | null;
  defaultKeyValueStoreId: string | null;
  defaultRequestQueueId: string | null;
}

export interface ActorTaskSummary {
  id: string;
  actorId: string;
  actorName?: string;
  name: string;
  description: string | null;
  inputJson: Record<string, unknown>;
  memoryMbytes: number;
  timeoutSecs: number;
  lastRunId: string | null;
  lastRunStatus?: RunStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleSummary {
  id: string;
  name: string;
  description: string | null;
  cronExpression: string;
  timezone: string;
  isEnabled: boolean;
  attachedActions: Array<{
    type: 'ACTOR' | 'TASK';
    targetId: string;
    inputJson?: Record<string, unknown>;
  }>;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
}

export interface DatasetSummary {
  id: string;
  name: string | null;
  isNamed: boolean;
  itemCount: number;
  totalSizeBytes: number;
  retentionDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface KeyValueStoreSummary {
  id: string;
  name: string | null;
  isNamed: boolean;
  recordCount: number;
  totalSizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

export interface RequestQueueSummary {
  id: string;
  name: string | null;
  isNamed: boolean;
  totalRequests: number;
  handledRequests: number;
  pendingRequests: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTokenSummary {
  id: string;
  name: string;
  tokenPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface WebhookSummary {
  id: string;
  name: string;
  requestUrl: string;
  eventTypes: WebhookEvent[];
  isEnabled: boolean;
  createdAt: string;
}

export interface MetricSample {
  timestamp: string;
  cpuPercent: number;
  memoryUsedMbytes: number;
  memoryLimitMbytes: number;
  networkInputBytes: number;
  networkOutputBytes: number;
}
