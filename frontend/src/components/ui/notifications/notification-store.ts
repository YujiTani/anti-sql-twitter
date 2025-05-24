import { atom, useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

export type Notification = {
  id: string;
  type: 'error' | 'success';
  message: string;
};

export type NotificationStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
};

const notificationsAtom = atom<Notification[]>([]);
const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, 'id'>) => {
    const id = uuidv4();
    const newNotification: Notification = {
      id,
      ...notification,
    };

    set(notificationsAtom, [...get(notificationsAtom), newNotification]);
  },
);

const dismissNotificationAtom = atom(null, (get, set, id: string) => {
  set(
    notificationsAtom,
    get(notificationsAtom).filter((notification) => notification.id !== id),
  );
});

export function useNotificationStore(): NotificationStore {
  const [notifications] = useAtom(notificationsAtom);
  const [, addNotification] = useAtom(addNotificationAtom);
  const [, dismissNotification] = useAtom(dismissNotificationAtom);

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
}
