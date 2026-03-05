import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Link, Unlink,
} from "lucide-react";

type RichTextEditorProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
};

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex size-7 items-center justify-center rounded-md transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1",
        active && "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="bg-border mx-1 h-5 w-px shrink-0" />;
}

export function RichTextEditor({
  name,
  label,
  defaultValue = "",
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const hiddenRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = defaultValue;
    if (hiddenRef.current) hiddenRef.current.value = defaultValue;
  }, [defaultValue]);

  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncFormats();
  }

  function syncFormats() {
    const active = new Set<string>();
    const commands = ["bold", "italic", "underline", "strikethrough",
      "insertUnorderedList", "insertOrderedList"];
    commands.forEach((cmd) => {
      if (document.queryCommandState(cmd)) active.add(cmd);
    });
    setActiveFormats(active);
  }

  function handleInput() {
    if (!editorRef.current || !hiddenRef.current) return;
    hiddenRef.current.value = editorRef.current.innerHTML;
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  function handleLink() {
    const url = prompt("URL do link:");
    if (url) exec("createLink", url);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}

      <div className="rounded-xl border shadow-sm">
        {/* Toolbar */}
        <div className="bg-muted/50 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b px-2 py-1.5">
          {/* Formatação de texto */}
          <ToolbarButton title="Negrito (Ctrl+B)" active={activeFormats.has("bold")} onClick={() => exec("bold")}>
            <Bold className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Itálico (Ctrl+I)" active={activeFormats.has("italic")} onClick={() => exec("italic")}>
            <Italic className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Sublinhado (Ctrl+U)" active={activeFormats.has("underline")} onClick={() => exec("underline")}>
            <Underline className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Tachado" active={activeFormats.has("strikethrough")} onClick={() => exec("strikethrough")}>
            <Strikethrough className="size-3.5" />
          </ToolbarButton>

          <Divider />

          {/* Alinhamento */}
          <ToolbarButton title="Alinhar à esquerda" onClick={() => exec("justifyLeft")}>
            <AlignLeft className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Centralizar" onClick={() => exec("justifyCenter")}>
            <AlignCenter className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Alinhar à direita" onClick={() => exec("justifyRight")}>
            <AlignRight className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Justificar" onClick={() => exec("justifyFull")}>
            <AlignJustify className="size-3.5" />
          </ToolbarButton>

          <Divider />

          {/* Listas */}
          <ToolbarButton
            title="Lista com marcadores"
            active={activeFormats.has("insertUnorderedList")}
            onClick={() => exec("insertUnorderedList")}
          >
            <List className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Lista numerada"
            active={activeFormats.has("insertOrderedList")}
            onClick={() => exec("insertOrderedList")}
          >
            <ListOrdered className="size-3.5" />
          </ToolbarButton>

          <Divider />

          {/* Link */}
          <ToolbarButton title="Inserir link" onClick={handleLink}>
            <Link className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Remover link" onClick={() => exec("unlink")}>
            <Unlink className="size-3.5" />
          </ToolbarButton>

          <Divider />

          {/* Histórico */}
          <ToolbarButton title="Desfazer (Ctrl+Z)" onClick={() => exec("undo")}>
            <Undo className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Refazer (Ctrl+Y)" onClick={() => exec("redo")}>
            <Redo className="size-3.5" />
          </ToolbarButton>
        </div>

        {/* Área editável */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={handleInput}
          onBlur={handleInput}
          onPaste={handlePaste}
          onKeyUp={syncFormats}
          onMouseUp={syncFormats}
          className={cn(
            "bg-background min-h-36 w-full rounded-b-xl px-4 py-3 text-sm outline-none",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-inset",
            // prose para renderizar listas e links corretamente
            "prose prose-sm dark:prose-invert max-w-none",
            "prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4",
            "prose-a:text-primary prose-a:underline",
            // placeholder via CSS
            "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          )}
        />
      </div>

      <textarea ref={hiddenRef} name={name} className="hidden" defaultValue={defaultValue} />
    </div>
  );
}