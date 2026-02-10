import type { ClientSummary } from '@/repositories/transactions/types';

export interface ClientSearchResult extends ClientSummary {
  exists: boolean;
}
