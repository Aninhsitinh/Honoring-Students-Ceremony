export function tSem(name, t) {
  if (!name) return '';
  if (name === 'Kỳ Xuân') return t('admin.sem_spring');
  if (name === 'Kỳ Hè') return t('admin.sem_summer');
  if (name === 'Kỳ Thu') return t('admin.sem_fall');
  return name;
}
