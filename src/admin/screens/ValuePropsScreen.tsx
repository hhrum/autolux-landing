import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { EntityList } from '../components/EntityList';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeaderFields } from '../components/fields/SectionHeaderFields';
import { newId, reorderByIndex } from '../mock-data';
import type { SectionMeta } from '../types';
import { Separator } from '@/components/ui/separator';

export function ValuePropsScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [header, setHeader] = useState<SectionMeta>(data.sections.valueProps);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Преимущества" backTo="/" />
      <div className="space-y-4 p-3">
        <SectionHeaderFields value={header} onChange={setHeader} />
        <FormActions
          className="static border-0 p-0"
          onCancel={() => setHeader(data.sections.valueProps)}
          onSave={() => {
            setData((prev) => ({
              ...prev,
              sections: { ...prev.sections, valueProps: header },
            }));
            saveMock();
          }}
          saveLabel="Сохранить шапку"
        />
      </div>
      <Separator />
      <EntityList
        items={data.valueProps}
        getTitle={(item) => item.title}
        getSubtitle={(item) => item.description}
        editPath={(id) => `/value-props/${id}`}
        onReorder={(from, to) => {
          setData((prev) => ({
            ...prev,
            valueProps: reorderByIndex(
              [...prev.valueProps].sort((a, b) => a.order - b.order),
              from,
              to,
            ),
          }));
          saveMock('Порядок обновлён (мок)');
        }}
        onDelete={(id) => {
          setData((prev) => ({
            ...prev,
            valueProps: prev.valueProps
              .filter((item) => item.id !== id)
              .map((item, i) => ({ ...item, order: i + 1 })),
          }));
          saveMock('Удалено (мок)');
        }}
        onAdd={() => {
          const id = newId('vp');
          setData((prev) => ({
            ...prev,
            valueProps: [
              ...prev.valueProps,
              {
                id,
                icon: '',
                title: 'Новое преимущество',
                description: '',
                order: prev.valueProps.length + 1,
              },
            ],
          }));
          navigate(`/value-props/${id}`);
        }}
        addLabel="Добавить пункт"
      />
    </div>
  );
}
