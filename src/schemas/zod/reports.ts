import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

/** Catalogul curat / preview-ul de alerte / histograma de volum vin în plicul standard,
 *  cu data fie o listă (rânduri/rapoarte/intervale), fie un obiect descriptiv (meta). */
export const ReportDataSchema = z.unknown();
export const ReportResponseSchema = apiEnvelope(ReportDataSchema);
export type ApiReportResponse = z.infer<typeof ReportResponseSchema>;
