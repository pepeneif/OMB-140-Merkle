import { ChevronDown, MessagesSquare, SquarePen } from "lucide-react";
import { openBotThread, useStore, type Bot } from "@/state/store";
import { useShowThreads } from "@/lib/thread-preferences";
import { t } from "@/lib/i18n";
import { localizedTaskTitle } from "@/lib/task-title";
import { cn } from "@/lib/cn";
import { ELEVATED_FLOAT, ELEVATED_HOVER, ELEVATED_OPEN } from "./elevated";
import { SidebarPopoverMenu, type SidebarMenuItem } from "./SidebarPopoverMenu";
import { orderedThreadList } from "./SidebarThreadRow";

/** A19 (v140): desplegable de hilos abiertos con el bot, entre el nombre y el icono de la computadora.
 *  La caja de la lista usa la misma superficie que la pastilla del nombre (blanca en Atelier, oscura en los demas temas). */
export function ChatHeadThreads({ bot: profile }: { bot: Bot }) {
  const { dispatch } = useStore();
  const showThreads = useShowThreads();
  const threads = showThreads ? [] : orderedThreadList((profile.tasks ?? []).filter((task) => !task.routineRunId));
  const items: SidebarMenuItem[] = [
    ...(threads.length < 2 ? [] : threads.map((task) => ({
      key: `thread:${task.threadId}`,
      label: localizedTaskTitle(task.title || t("task.newShort")),
      icon: <MessagesSquare size={16} />,
      active: task.threadId === profile.threadId,
      onSelect: () => openBotThread(dispatch, profile, task.threadId, showThreads),
    } satisfies SidebarMenuItem))),
    {
      key: "new-thread",
      heading: t("task.list"),
      separatorBefore: threads.length >= 2,
      label: t("task.newShort"),
      icon: <SquarePen size={16} />,
      onSelect: () => dispatch({ type: "newTask", botId: profile.id }),
    },
  ];
  return (
    <SidebarPopoverMenu
      items={items}
      ariaLabel={t("task.switch")}
      placement="below"
      align="end"
      triggerClassName="rounded-full"
      triggerTitle={t("task.switch")}
      renderTrigger={({ open }) => (
        <span
          data-testid="chathead-threads"
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-ink/[0.06] hover:text-ink",
            open && "bg-ink/[0.06] text-ink",
          )}
        >
          <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
        </span>
      )}
    />
  );
}
