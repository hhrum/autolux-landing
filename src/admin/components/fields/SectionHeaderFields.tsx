import { Input } from '@/components/ui/input';
import { Field } from './Field';
import type { SectionMeta } from '../../types';

type SectionHeaderFieldsProps = {
  value: SectionMeta;
  onChange: (value: SectionMeta) => void;
  showReviewsExtras?: boolean;
};

export function SectionHeaderFields({
  value,
  onChange,
  showReviewsExtras = false,
}: SectionHeaderFieldsProps) {
  return (
    <div className="grid gap-4">
      <Field label="Badge">
        <Input
          value={value.badge}
          onChange={(e) => onChange({ ...value, badge: e.target.value })}
        />
      </Field>
      <Field label="Заголовок">
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </Field>
      {showReviewsExtras ? (
        <>
          <Field label="Заголовок короткий (моб.)">
            <Input
              value={value.titleShort ?? ''}
              onChange={(e) => onChange({ ...value, titleShort: e.target.value })}
            />
          </Field>
          <Field label="Рейтинг общий">
            <Input
              value={value.rating ?? ''}
              onChange={(e) => onChange({ ...value, rating: e.target.value })}
            />
          </Field>
          <Field label="Рейтинг короткий">
            <Input
              value={value.ratingShort ?? ''}
              onChange={(e) => onChange({ ...value, ratingShort: e.target.value })}
            />
          </Field>
        </>
      ) : null}
    </div>
  );
}
