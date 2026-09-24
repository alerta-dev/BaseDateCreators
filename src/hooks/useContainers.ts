import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, Container } from '../types';

export function useContainers(category: Category | null) {
  const [items, setItems] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!category) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('containers')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setItems([]);
    } else {
      setItems((data ?? []) as Container[]);
    }

    setLoading(false);
  }, [category]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload };
}
