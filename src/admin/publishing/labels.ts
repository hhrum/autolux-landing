export function mergeReasonRu(reason?: string): string {
  switch (reason) {
    case 'up_to_date':
      return 'Черновик не отличается от main';
    case 'conflicts':
      return 'Есть конфликты с main';
    case 'no_draft':
      return 'Ветка draft ещё не создана';
    case 'no_main':
      return 'Ветка main не найдена';
    case 'checks_pending':
      return 'GitHub ещё считает mergeable…';
    case 'diverged':
      return 'Ветки разошлись — можно попробовать merge';
    case 'ready':
      return 'Готово к публикации';
    default:
      return reason ? `Статус: ${reason}` : 'Нельзя опубликовать';
  }
}
