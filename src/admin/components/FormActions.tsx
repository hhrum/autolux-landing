import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FormActionsProps = {
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  className?: string;
};

export function FormActions({
  onSave,
  onCancel,
  saveLabel = 'Сохранить',
  className,
}: FormActionsProps) {
  return (
    <div className={cn('sticky bottom-0 flex gap-2 border-t border-border bg-background p-3', className)}>
      <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
        Отменить
      </Button>
      <Button type="button" className="flex-1" onClick={onSave}>
        {saveLabel}
      </Button>
    </div>
  );
}
