import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { ImageField } from '../components/fields/ImageField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BeforeAfterItem } from '../types';

export function BeforeAfterEditScreen() {
  const { id } = useParams();
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const existing = useMemo(
    () => data.beforeAfter.find((item) => item.id === id),
    [data.beforeAfter, id],
  );
  const [form, setForm] = useState<BeforeAfterItem | null>(existing ?? null);

  if (!existing || !form) return <Navigate to="/before-after" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Кейс" backTo="/before-after" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <Field label="Название">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Описание">
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <ImageField
          label="Фото «До»"
          value={form.before}
          onChange={(before) => setForm({ ...form, before })}
        />
        <ImageField
          label="Фото «После»"
          value={form.after}
          onChange={(after) => setForm({ ...form, after })}
        />
      </div>
      <FormActions
        onCancel={() => navigate('/before-after')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            beforeAfter: prev.beforeAfter.map((item) => (item.id === form.id ? form : item)),
          }));
          saveMock();
          navigate('/before-after');
        }}
      />
    </div>
  );
}
