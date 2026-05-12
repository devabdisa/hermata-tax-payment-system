/**
 * List endpoints accept `hasPagination` (query). When false, return all matching rows (no skip/take, no meta).
 * Default is paginated (true).
 */
export function wantsPagination(filters: Record<string, unknown>): boolean {
  const v = filters['hasPagination'];
  if (v === false || v === 'false' || v === '0' || v === 0) {
    return false;
  }
  return true;
}
