export const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const today = () => new Date().toISOString().slice(0, 10);

const highest = (list, fallback) => {
  const nums = list.map((x) => Number(String(x.id).replace(/\D/g, ''))).filter(Number.isFinite);
  return (nums.length ? Math.max(...nums) : fallback) + 1;
};

export const nextLeadId = (leads) => 'L-' + highest(leads, 1000);
export const nextProjectId = (projects) => 'SF-' + highest(projects, 2400);
export const nextDemoId = (demos) => 'dm_' + String(highest(demos, 0)).padStart(3, '0');

/* last 8 digits, so +91 and spacing never matter */
export const phoneTail = (s) => String(s || '').replace(/\D/g, '').slice(-8);
