<?php

namespace App\Events\Machines;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MachineCloneBatchFinished implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public readonly int $userId,
        public readonly string $machineName,
        public readonly int $total,
        public readonly int $failed,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->userId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'machine.clone.finished';
    }

    public function broadcastWith(): array
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
