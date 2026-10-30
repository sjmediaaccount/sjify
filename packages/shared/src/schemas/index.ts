import { z } from 'zod';
import { PricingModel, ActorVisibility, RunOrigin } from '../constants/index.js';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const CreateActorSchema = z.object({
  name: z.string().min(2).max(64),
  slug: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).default(''),
  visibility: z.nativeEnum(ActorVisibility).default(ActorVisibility.PUBLIC),
  pricingModel: z.nativeEnum(PricingModel).default(PricingModel.FREE),
  priceUsd: z.number().min(0).default(0),
  defaultMemoryMbytes: z.number().min(128).max(32768).default(1024),
  defaultTimeoutSecs: z.number().min(10).max(86400).default(3600),
});

export const TriggerRunSchema = z.object({
  input: z.record(z.unknown()).optional().default({}),
  memoryMbytes: z.number().min(128).max(32768).optional(),
  timeoutSecs: z.number().min(10).max(86400).optional(),
  buildTag: z.string().optional().default('latest'),
  origin: z.nativeEnum(RunOrigin).optional().default(RunOrigin.WEB),
  waitForFinish: z.number().min(0).max(300).optional(),
});

export const CreateTaskSchema = z.object({
  name: z.string().min(2).max(64),
  description: z.string().max(500).optional(),
  inputJson: z.record(z.unknown()).default({}),
  memoryMbytes: z.number().min(128).max(32768).default(1024),
  timeoutSecs: z.number().min(10).max(86400).default(3600),
  buildTag: z.string().default('latest'),
});

export const CreateScheduleSchema = z.object({
  name: z.string().min(2).max(64),
  description: z.string().max(500).optional(),
  cronExpression: z.string().min(5),
  timezone: z.string().default('UTC'),
  isEnabled: z.boolean().default(true),
  attachedActions: z.array(
    z.object({
      type: z.enum(['ACTOR', 'TASK']),
      targetId: z.string(),
      inputJson: z.record(z.unknown()).optional(),
    })
  ).min(1),
});

export const CreateApiTokenSchema = z.object({
  name: z.string().min(2).max(64),
  scopes: z.array(z.string()).default(['*']),
  expiresInDays: z.number().min(1).max(365).optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreateActorInput = z.infer<typeof CreateActorSchema>;
export type TriggerRunInput = z.infer<typeof TriggerRunSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type CreateScheduleInput = z.infer<typeof CreateScheduleSchema>;
export type CreateApiTokenInput = z.infer<typeof CreateApiTokenSchema>;
