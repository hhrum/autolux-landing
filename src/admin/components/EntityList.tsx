import { ArrowDown, ArrowUp, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type EntityListProps<T extends { id: string; order: number }> = {
  items: T[];
  getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string | undefined;
  editPath: (id: string) => string;
  onReorder: (from: number, to: number) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  addLabel?: string;
};

export function EntityList<T extends { id: string; order: number }>({
  items,
  getTitle,
  getSubtitle,
  editPath,
  onReorder,
  onDelete,
  onAdd,
  addLabel = 'Добавить',
}: EntityListProps<T>) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="grid min-w-0 gap-2 overflow-hidden p-3">
      {sorted.map((item, index) => {
        const subtitle = getSubtitle?.(item);
        return (
          <div
            key={item.id}
            className="flex min-w-0 items-center gap-1 overflow-hidden rounded-lg border border-border bg-background"
          >
            <div className="flex shrink-0 flex-col gap-0.5 p-1">
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                disabled={index === 0}
                onClick={() => onReorder(index, index - 1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                disabled={index === sorted.length - 1}
                onClick={() => onReorder(index, index + 1)}
              >
                <ArrowDown />
              </Button>
            </div>
            <Link
              to={editPath(item.id)}
              className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden py-3 pr-2"
            >
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium">{getTitle(item)}</div>
                {subtitle ? (
                  <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
                ) : null}
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="mr-1 shrink-0 text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      })}
      <Button type="button" variant="outline" className="mt-1 justify-start" onClick={onAdd}>
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
}
