import { useDecarbonisationStore } from '@/features/decarbonisation/api/decarbonisation.store';
import { useRef, useEffect } from 'react';

export type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  item?: {
    name: string;
    image?: string;
  };
};

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'できた！',
  cancelText = 'キャンセル',
  item,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {decarbonisations} = useDecarbonisationStore()

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // キャンセル時の処理（ESCキーやダイアログ外クリックも含む）
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black-overray fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg"
      onClick={(e) => {
        // ダイアログ内部をクリックした場合は何もしない
        // ダイアログ自体（backdrop部分）をクリックした場合は閉じる
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="min-w-[300px] max-w-md overflow-hidden rounded-lg shadow-2xl">
        <div className="bg-green-600 px-4 py-3 text-white">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>

        <div className="bg-white p-6">
          <div className="mb-4 flex justify-center flex-wrap gap-1.5">
          {decarbonisations.length > 0 && decarbonisations.map((decarbonisation) => (
            decarbonisation.image && (
              <img
                key={decarbonisation.uuid}
                src={decarbonisation.image}
                alt={decarbonisation.name}
                className="h-32 w-32 rounded-lg object-cover"
              />
            )
          ))}
            </div>

          {item && (
            <h4 className="mb-2 text-center text-lg font-bold text-gray-800">
              {item.name}
            </h4>
          )}

          <p className="text-gray-600">{message}</p>
        </div>

        {/* ボタン */}
        <div className="flex justify-end space-x-2 bg-gray-50 px-4 py-3">
          <button
            type="button"
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
