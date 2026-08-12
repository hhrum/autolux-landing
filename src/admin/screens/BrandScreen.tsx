import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { ImageField } from '../components/fields/ImageField';
import { Input } from '@/components/ui/input';
import type { BrandData } from '../types';

export function BrandScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState<BrandData>(data.brand);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Бренд и футер" backTo="/" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <Field label="Название бренда">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Tagline">
          <Input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </Field>
        <Field label="Телефон (отображение)">
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="Телефон (tel:)">
          <Input
            value={form.phoneHref}
            onChange={(e) => setForm({ ...form, phoneHref: e.target.value })}
          />
        </Field>
        <ImageField
          label="Логотип"
          value={form.logo}
          onChange={(logo) => setForm({ ...form, logo })}
        />
        <Field label="Копирайт">
          <Input
            value={form.copyright}
            onChange={(e) => setForm({ ...form, copyright: e.target.value })}
          />
        </Field>
      </div>
      <FormActions
        onCancel={() => navigate('/')}
        onSave={() => {
          setData((prev) => ({ ...prev, brand: form }));
          saveMock();
          navigate('/');
        }}
      />
    </div>
  );
}
