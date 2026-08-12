import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field } from './Field';

type RepeaterFieldProps<T> = {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
  getKey?: (item: T, index: number) => string;
};

export function RepeaterField<T>({
  label,
  items,
  onChange,
  createItem,
  renderItem,
  addLabel = 'Добавить',
  getKey = (_item, index) => String(index),
}: RepeaterFieldProps<T>) {
  return (
    <Field label={label}>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div
            key={getKey(item, index)}
            className="grid gap-2 rounded-lg border border-border bg-muted/20 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...items];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    onChange(next);
                  }}
                >
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  disabled={index === items.length - 1}
                  onClick={() => {
                    const next = [...items];
                    [next[index], next[index + 1]] = [next[index + 1], next[index]];
                    onChange(next);
                  }}
                >
                  <ArrowDown />
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
            {renderItem(item, index, (patch) => {
              const next = [...items];
              next[index] = { ...item, ...patch };
              onChange(next);
            })}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-start"
          onClick={() => onChange([...items, createItem()])}
        >
          <Plus />
          {addLabel}
        </Button>
      </div>
    </Field>
  );
}
