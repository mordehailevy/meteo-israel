export interface SearchHistoryEntry {
  id: string;
  timestamp: string;
  city: string;
  country: string;
}

const STORAGE_KEY = "weather-search-history";

export function getSearchHistory(): SearchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SearchHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(entry: SearchHistoryEntry): void {
  const history = getSearchHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
