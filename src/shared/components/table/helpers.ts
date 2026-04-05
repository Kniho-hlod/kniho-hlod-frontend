import type { TableColumnDefinition } from './types';

export function getNestedValue(obj: Record<string, unknown>, path: string | string[]): unknown {
  if (typeof path === 'string') {
    return obj[path];
  }

  if (Array.isArray(path)) {
    return path.reduce<unknown>((current, key) => {
      if (current !== null && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return null;
    }, obj);
  }

  return null;
}

export function formatValue(value: unknown, column: TableColumnDefinition): unknown {
  if (!value) return value;

  switch (column.type) {
    case 'date':
      return formatDateValue(value);
    case 'boolean':
      return value ? 'Ano' : 'Ne';
    default:
      return value;
  }
}

function formatDateValue(value: unknown): string {
  const date = new Date(value as string | number | Date);
  if (isNaN(date.getTime())) return String(value);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
