import { useCallback, useSyncExternalStore } from "react";
import { getSearchHistory } from "../services/history";
import type { SearchHistoryEntry } from "../services/history";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("focus", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("focus", onStoreChange);
  };
}

export default function History() {
  const getSnapshot = useCallback(() => {
    return JSON.stringify(getSearchHistory());
  }, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot);
  const history: SearchHistoryEntry[] = JSON.parse(raw);

  return (
    <section className="page">
      <div className="page-title">
        <h2>Search History</h2>
        <p>List of your recent weather searches.</p>
      </div>

      <div className="card">
        {history.length === 0 ? (
          <p className="empty-state">No searches yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>City</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td>{new Date(entry.timestamp).toLocaleString("en-US")}</td>
                  <td>{entry.city}</td>
                  <td>{entry.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
