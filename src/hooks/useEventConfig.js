// ============================================================
// useEventConfig — Loads all event data with loading/error state
// ============================================================

import { useState, useEffect } from 'react';
import { getEventConfig, getMenu, getTimeline, getMedia } from '../services/eventApi';

export function useEventConfig() {
  const [state, setState] = useState({
    config: null,
    menu: [],
    timeline: [],
    media: [],
    isLoading: true,
    isRemote: false,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [configResult, menuResult, timelineResult, mediaResult] = await Promise.all([
          getEventConfig(),
          getMenu(),
          getTimeline(),
          getMedia(),
        ]);

        if (!mounted) return;

        setState({
          config: configResult.data,
          menu: menuResult.data,
          timeline: timelineResult.data,
          media: mediaResult.data,
          isLoading: false,
          isRemote: configResult.isRemote,
          error: null,
        });
      } catch (err) {
        if (!mounted) return;
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err.message,
        }));
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  return state;
}
