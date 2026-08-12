import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { ImageField } from '../components/fields/ImageField';
import { RepeaterField } from '../components/fields/RepeaterField';
import { SectionHeaderFields } from '../components/fields/SectionHeaderFields';
import type { ContactsData, SectionMeta } from '../types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export function ContactsScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [header, setHeader] = useState<SectionMeta>(data.sections.contacts);
  const [form, setForm] = useState<ContactsData>(data.contacts);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Контакты" backTo="/" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <SectionHeaderFields value={header} onChange={setHeader} />
        <Separator />
        <ImageField
          label="Карта"
          value={form.map}
          onChange={(map) => setForm({ ...form, map })}
        />
        <RepeaterField
          label="Пункты контактов"
          items={form.items}
          onChange={(items) => setForm({ ...form, items })}
          createItem={() => ({
            icon: 'map' as const,
            label: '',
            value: '',
            valueShort: '',
            href: '',
          })}
          addLabel="Добавить контакт"
          renderItem={(item, _i, update) => (
            <div className="grid gap-2">
              <Field label="Иконка">
                <Select
                  value={item.icon}
                  onValueChange={(icon) =>
                    update({ icon: (icon as 'map' | 'phone' | 'clock') ?? 'map' })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="map">map</SelectItem>
                    <SelectItem value="phone">phone</SelectItem>
                    <SelectItem value="clock">clock</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Подпись">
                <Input value={item.label} onChange={(e) => update({ label: e.target.value })} />
              </Field>
              <Field label="Значение">
                <Input value={item.value} onChange={(e) => update({ value: e.target.value })} />
              </Field>
              <Field label="Короткое значение (моб.)">
                <Input
                  value={item.valueShort ?? ''}
                  onChange={(e) => update({ valueShort: e.target.value })}
                />
              </Field>
              <Field label="Ссылка" hint="Опционально: tel:, URL">
                <Input
                  value={item.href ?? ''}
                  onChange={(e) => update({ href: e.target.value })}
                />
              </Field>
            </div>
          )}
        />
        <RepeaterField
          label="Соцсети"
          items={form.socials}
          onChange={(socials) => setForm({ ...form, socials })}
          createItem={() => ({ label: '', href: '', variant: 'vk' as const })}
          addLabel="Добавить соцсеть"
          renderItem={(item, _i, update) => (
            <div className="grid gap-2">
              <Field label="Название">
                <Input value={item.label} onChange={(e) => update({ label: e.target.value })} />
              </Field>
              <Field label="Ссылка">
                <Input value={item.href} onChange={(e) => update({ href: e.target.value })} />
              </Field>
              <Field label="Тип">
                <Select
                  value={item.variant}
                  onValueChange={(variant) =>
                    update({ variant: (variant as 'vk' | 'tg') ?? 'vk' })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vk">VK</SelectItem>
                    <SelectItem value="tg">Telegram</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}
        />
      </div>
      <FormActions
        onCancel={() => navigate('/')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            sections: { ...prev.sections, contacts: header },
            contacts: form,
          }));
          saveMock();
          navigate('/');
        }}
      />
    </div>
  );
}
