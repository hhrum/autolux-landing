import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { ImageField } from '../components/fields/ImageField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ValuePropItem } from '../types';

export function ValuePropEditScreen() {
  const { id } = useParams();
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const existing = useMemo(
    () => data.valueProps.find((item) => item.id === id),
    [data.valueProps, id],
  );
  const [form, setForm] = useState<ValuePropItem | null>(existing ?? null);

  if (!existing || !form) return <Navigate to="/value-props" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Преимущество" backTo="/value-props" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <Field label="Заголовок">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Описание">
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <ImageField
          label="Иконка"
          value={form.icon}
          onChange={(icon) => setForm({ ...form, icon })}
        />
      </div>
      <FormActions
        onCancel={() => navigate('/value-props')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            valueProps: prev.valueProps.map((item) => (item.id === form.id ? form : item)),
          }));
          saveMock();
          navigate('/value-props');
        }}
      />
    </div>
  );
}
