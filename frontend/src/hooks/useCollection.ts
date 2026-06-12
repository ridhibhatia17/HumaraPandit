import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useCollection<T extends { id: string }>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const apiEndpoint = endpoint.startsWith("http") ? endpoint : `${import.meta.env.VITE_API_BASE_URL || ""}${endpoint}`;

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      toast.error(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (newItem: Omit<T, "id">) => {
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      setData((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      toast.error(err.message || "Error creating item");
      throw err;
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Error updating item");
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err.message || "Error deleting item");
      throw err;
    }
  };

  return { data, loading, create, update, remove, refetch: fetchAll, setData };
}
