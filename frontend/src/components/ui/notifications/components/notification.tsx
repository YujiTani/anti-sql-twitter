import { CircleCheck, CircleX } from 'lucide-react';

const icons = {
  success: <CircleCheck className="size-6 text-green-500" />,
  error: <CircleX className="size-6 text-red-500" />,
};

export type NotificationProps = {
  notification: {
    id: string;
    type: keyof typeof icons;
    message: string;
  };
  onDismiss: (id: string) => void;
};

function Notification({
  notification: { id, type, message },
  onDismiss,
}: NotificationProps) {
  function getMessageColorClass() {
    switch (type) {
      case 'error':
        return 'text-red-800';
        break;
      case 'success':
        return 'text-green-700';
        break;
      default:
        throw Error('想定外の通知タイプが入力されました');
    }
  }

  return (
    <div className="z-20 flex w-full flex-col space-y-4">
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/5">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="ml-2 shrink-0">{icons[type]}</div>
            <p className={`ml-2 text-sm ${getMessageColorClass()}`}>
              {message}
            </p>
          </div>
          <button
            className="items-center-safe inline-flex rounded-lg bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => {
              onDismiss(id);
            }}
          >
            <CircleX className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
