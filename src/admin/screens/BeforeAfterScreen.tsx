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

export function BeforeAfterScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [header, setHeader] = useState<SectionMeta>(data.sections.beforeAfter);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="До / После" backTo="/" />
      <div className="space-y-4 p-3">
        <SectionHeaderFields value={header} onChange={setHeader} />
        <FormActions
          className="static border-0 p-0"
          onCancel={() => setHeader(data.sections.beforeAfter)}
          onSave={() => {
            setData((prev) => ({
              ...prev,
              sections: { ...prev.sections, beforeAfter: header },
            }));
            saveMock();
          }}
          saveLabel="Сохранить шапку"
        />
      </div>
      <Separator />
      <EntityList
        items={data.beforeAfter}
        getTitle={(item) => item.title}
        getSubtitle={(item) => item.description}
        editPath={(id) => `/before-after/${id}`}
        onReorder={(from, to) => {
          setData((prev) => ({
            ...prev,
            beforeAfter: reorderByIndex(
              [...prev.beforeAfter].sort((a, b) => a.order - b.order),
              from,
              to,
            ),
          }));
          saveMock('Порядок обновлён (мок)');
        }}
        onDelete={(id) => {
          setData((prev) => ({
            ...prev,
            beforeAfter: prev.beforeAfter
              .filter((item) => item.id !== id)
              .map((item, i) => ({ ...item, order: i + 1 })),
          }));
          saveMock('Удалено (мок)');
        }}
        onAdd={() => {
          const id = newId('ba');
          setData((prev) => ({
            ...prev,
            beforeAfter: [
              ...prev.beforeAfter,
              {
                id,
                title: 'Новый кейс',
                description: '',
                before: '',
                after: '',
                order: prev.beforeAfter.length + 1,
              },
            ],
          }));
          navigate(`/before-after/${id}`);
        }}
        addLabel="Добавить кейс"
      />
    </div>
  );
}
