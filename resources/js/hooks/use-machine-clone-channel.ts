import { useEcho } from "@laravel/echo-react";
import { usePage } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";


type CloneFinishedPayload = {
  type: "success" | "warning" | "error";
  message: string;
};

export function useMachineCloneChannel() {
  const { auth } = usePage().props as any;
  const { toast } = useToast();
  const userId = auth?.user?.id as number | undefined;
  const channel = userId ? `user.${userId}` : "";
  const event = ".machine.clone.finished";

  useEcho<CloneFinishedPayload>(channel, event, (payload) => {
    if (!userId) return;
    console.log(payload);
    toast(payload.message, payload.type ?? "default");
  },
    [userId],
    "private",
  );
}