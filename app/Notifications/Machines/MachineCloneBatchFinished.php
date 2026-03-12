<?php

namespace App\Notifications\Machines;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MachineCloneBatchFinished extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly string $machineName,
        private readonly int $total,
        private readonly int $failed,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $success = $this->total - $this->failed;

        return [
            'type' => $this->failed > 0 ? 'warning' : 'success',
            'message' => $this->failed > 0
                ? "Clonagem de \"{$this->machineName}\" concluída com alertas: {$success} criadas, {$this->failed} falhou."
                : "Clonagem de \"{$this->machineName}\" concluída! {$success} máquina(s) criada(s) com sucesso.",
        ];
    }
}
