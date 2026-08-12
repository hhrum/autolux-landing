import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { ImageField } from '../components/fields/ImageField';
import { MarkdownField } from '../components/fields/MarkdownField';
import { RepeaterField } from '../components/fields/RepeaterField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { HeroData } from '../types';

export function HeroScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState<HeroData>(data.hero);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Hero" backTo="/" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <ImageField
          label="Фон"
          value={form.image}
          onChange={(image) => setForm({ ...form, image })}
        />
        <Field label="Badge">
          <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
        </Field>
        <MarkdownField
          label="Заголовок"
          value={form.title}
          onChange={(title) => setForm({ ...form, title })}
          rows={3}
        />
        <Field label="Описание">
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <Field label="Основная кнопка — текст">
          <Input
            value={form.primaryCta.label}
            onChange={(e) =>
              setForm({ ...form, primaryCta: { ...form.primaryCta, label: e.target.value } })
            }
          />
        </Field>
        <Field label="Основная кнопка — ссылка">
          <Input
            value={form.primaryCta.href}
            onChange={(e) =>
              setForm({ ...form, primaryCta: { ...form.primaryCta, href: e.target.value } })
            }
          />
        </Field>
        <Field label="Вторая кнопка — текст">
          <Input
            value={form.secondaryCta.label}
            onChange={(e) =>
              setForm({ ...form, secondaryCta: { ...form.secondaryCta, label: e.target.value } })
            }
          />
        </Field>
        <Field label="Вторая кнопка — ссылка">
          <Input
            value={form.secondaryCta.href}
            onChange={(e) =>
              setForm({ ...form, secondaryCta: { ...form.secondaryCta, href: e.target.value } })
            }
          />
        </Field>
        <RepeaterField
          label="Статы"
          items={form.stats}
          onChange={(stats) => setForm({ ...form, stats })}
          createItem={() => ({ label: '', value: '' })}
          addLabel="Добавить стату"
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Label"
                value={item.label}
                onChange={(e) => update({ label: e.target.value })}
              />
              <Input
                placeholder="Value"
                value={item.value}
                onChange={(e) => update({ value: e.target.value })}
              />
            </div>
          )}
        />
      </div>
      <FormActions
        onCancel={() => navigate('/')}
        onSave={() => {
          setData((prev) => ({ ...prev, hero: form }));
          saveMock();
          navigate('/');
        }}
      />
    </div>
  );
}
