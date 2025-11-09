import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface JDMetricsCardProps {
  title: string;
  icon?: ReactNode;
  items: Array<{ value: string; isStudentAdded: boolean; id?: string | number }>;
  onAdd?: () => void;
  onRemove?: (id: string | number) => void;
  allowAdd?: boolean;
  allowRemove?: boolean;
  emptyMessage?: string;
}

export function JDMetricsCard({
  title,
  icon,
  items,
  onAdd,
  onRemove,
  allowAdd = false,
  allowRemove = false,
  emptyMessage = 'No items found'
}: JDMetricsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <div className="text-blue-600 dark:text-blue-400">{icon}</div>}
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({items.length})
          </span>
        </div>
        {allowAdd && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            aria-label={`Add ${title.toLowerCase()}`}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add more</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge
              key={item.id || index}
              variant={item.isStudentAdded ? 'default' : 'secondary'}
              className={`flex items-center gap-1 ${
                item.isStudentAdded 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700' 
                  : ''
              }`}
            >
              {item.value}
              {allowRemove && item.isStudentAdded && onRemove && item.id && (
                <button
                  onClick={() => onRemove(item.id!)}
                  className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${item.value}`}
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              )}
              {!item.isStudentAdded && (
                <span className="sr-only">(Extracted from job description)</span>
              )}
              {item.isStudentAdded && (
                <span className="sr-only">(Added by you)</span>
              )}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
