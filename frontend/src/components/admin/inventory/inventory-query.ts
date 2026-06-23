type InventoryQueryParams = {
  locPage?: number;
  locQ?: string;
  stockPage?: number;
  stockQ?: string;
  stockLocation?: string;
  movePage?: number;
  moveType?: string;
  lowPage?: number;
};

export function buildInventoryHref(overrides: InventoryQueryParams) {
  const params = new URLSearchParams();

  if (overrides.locQ) params.set("locQ", overrides.locQ);
  if (overrides.locPage && overrides.locPage > 1) {
    params.set("locPage", String(overrides.locPage));
  }
  if (overrides.stockQ) params.set("stockQ", overrides.stockQ);
  if (overrides.stockLocation) params.set("stockLocation", overrides.stockLocation);
  if (overrides.stockPage && overrides.stockPage > 1) {
    params.set("stockPage", String(overrides.stockPage));
  }
  if (overrides.moveType) params.set("moveType", overrides.moveType);
  if (overrides.movePage && overrides.movePage > 1) {
    params.set("movePage", String(overrides.movePage));
  }
  if (overrides.lowPage && overrides.lowPage > 1) {
    params.set("lowPage", String(overrides.lowPage));
  }

  const query = params.toString();

  return query ? `/admin/inventory?${query}` : "/admin/inventory";
}
