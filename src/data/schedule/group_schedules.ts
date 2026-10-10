import { Schedule } from '../../types';

// fork: group schedules by the first tag starting with `prefix` (e.g. 'program:').
// Groups named in `names` come first (also when empty), then the discovered ones; '' = schedules without such a tag, last.
export const groupKey = (schedule: Schedule, prefix: string) =>
  (schedule.tags || []).find((t) => t.startsWith(prefix))?.slice(prefix.length) ?? '';

export const groupSchedules = <T extends Schedule>(items: T[], prefix: string, names: Record<string, string> = {}) => {
  const discovered = items
    .map((e) => groupKey(e, prefix))
    .filter((e) => e)
    .sort();
  const keys = [...new Set([...Object.keys(names), ...discovered].filter((e) => e)), ''];
  return keys.map((key) => ({ key, items: items.filter((e) => groupKey(e, prefix) == key) }));
};

// user input -> tag-safe group key: trimmed, lower case, no diacritics, spaces -> '_'
export const toGroupKey = (name: string) =>
  name.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '_');
