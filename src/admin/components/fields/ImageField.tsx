import { useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { configFromEnv } from '../../publishing/config';
import { resolveImageForDisplay } from '../../publishing/image-url';
import { Field } from './Field';

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

function displaySrc(value: string): string {
  const cfg = configFromEnv();
  if (!cfg) return value;
  return resolveImageForDisplay(value, {
    owner: cfg.owner,
    repo: cfg.repo,
    branch: cfg.draftBranch || cfg.mainBranch,
  });
}

export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Field label={label} hint="TODO: картинки в этой итерации не публикуются (только превью)">
      <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
        <div className="relative flex aspect-[16/10] items-center justify-center bg-muted">
          {value ? (
            <img src={displaySrc(value)} alt="" className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
          <span className="truncate text-[11px] text-muted-foreground">
            {value ? 'Превью' : 'Нет изображения'}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            Заменить
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              onChange(URL.createObjectURL(file));
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </Field>
  );
}
