import { notification } from "antd";

export type NotificationType = "success" | "info" | "warning" | "error";

export function useAppNotification() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    title: string,
    desc: string,
    time = 2
  ) => {
    api[type]({
      title: title,
      description: desc,
      duration: time,
    });
  };

  return {
    contextHolder,
    openNotification,
  };
}