import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { ImageField } from '../components/fields/ImageField';
import { MarkdownField } from '../components/fields/MarkdownField';
import { SectionHeaderFields } from '../components/fields/SectionHeaderFields';
import type { ComfortData, SectionMeta } from '../types';
import { Separator } from '@/components/ui/separator';

export function ComfortScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [header, setHeader] = useState<SectionMeta>(data.sections.comfort);
  const [form, setForm] = useState<ComfortData>(data.comfort);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Комфорт" backTo="/" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <SectionHeaderFields value={header} onChange={setHeader} />
        <Separator />
        <ImageField
          label="Изображение"
          value={form.image}
          onChange={(image) => setForm({ ...form, image })}
        />
        <MarkdownField
          label="Текст"
          value={form.body}
          onChange={(body) => setForm({ ...form, body })}
          hint="Абзац + список Markdown"
          rows={10}
        />
      </div>
      <FormActions
        onCancel={() => navigate('/')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            sections: { ...prev.sections, comfort: header },
            comfort: form,
          }));
          saveMock();
          navigate('/');
        }}
      />
    </div>
  );
}
