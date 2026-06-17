import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const ReportDataSchema = z.unknown();
export const ReportResponseSchema = apiEnvelope(ReportDataSchema);
export type ApiReportResponse = z.infer<typeof ReportResponseSchema>;
