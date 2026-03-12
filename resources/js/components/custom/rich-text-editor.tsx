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

// Converte o HTML do editor para HTML com estilos inline portáveis
function inlineStyles(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstChild as HTMLElement;

  const walk = (el: Element) => {
    const tag = el.tagName?.toLowerCase();

    const styleMap: Record<string, string> = {
      b:          "font-weight:bold",
      strong:     "font-weight:bold",
      i:          "font-style:italic",
      em:         "font-style:italic",
      u:          "text-decoration:underline",
      s:          "text-decoration:line-through",
      strike:     "text-decoration:line-through",
      ul:         "list-style-type:disc;padding-left:1.5em;margin:0.5em 0",
      ol:         "list-style-type:decimal;padding-left:1.5em;margin:0.5em 0",
      li:         "margin:0.25em 0;display:list-item",
      a:          "color:#2563eb;text-decoration:underline",
      p:          "margin:0.25em 0",
      blockquote: "border-left:3px solid #d1d5db;padding-left:1em;color:#6b7280;margin:0.5em 0",
    };

    if (tag && styleMap[tag]) {
      const existing = el.getAttribute("style") ?? "";
      const base = styleMap[tag];
      // não duplica estilos já existentes
      el.setAttribute("style", existing ? `${base};${existing}` : base);
    }

    // alinhamento via align attribute (gerado pelo execCommand justify*)
    const align = el.getAttribute("align");
    if (align) {
      const existing = el.getAttribute("style") ?? "";
      el.setAttribute("style", `text-align:${align};${existing}`);
      el.removeAttribute("align");
    }

    Array.from(el.children).forEach(walk);
  };

  Array.from(root.children).forEach(walk);
  return root.innerHTML;
}

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
    syncHidden();
  }

  function syncFormats() {
    const active = new Set<string>();
    const commands = [
      "bold", "italic", "underline", "strikethrough",
      "insertUnorderedList", "insertOrderedList",
    ];
    commands.forEach((cmd) => {
      if (document.queryCommandState(cmd)) active.add(cmd);
    });
    setActiveFormats(active);
  }

  function syncHidden() {
    if (!editorRef.current || !hiddenRef.current) return;
    hiddenRef.current.value = inlineStyles(editorRef.current.innerHTML);
  }

  function handleInput() {
    syncFormats();
    syncHidden();
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
          <ToolbarButton title="Negrito" active={activeFormats.has("bold")} onClick={() => exec("bold")}>
            <Bold className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Itálico" active={activeFormats.has("italic")} onClick={() => exec("italic")}>
            <Italic className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Sublinhado" active={activeFormats.has("underline")} onClick={() => exec("underline")}>
            <Underline className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Tachado" active={activeFormats.has("strikethrough")} onClick={() => exec("strikethrough")}>
            <Strikethrough className="size-3.5" />
          </ToolbarButton>

          <Divider />

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

          <ToolbarButton title="Inserir link" onClick={handleLink}>
            <Link className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Remover link" onClick={() => exec("unlink")}>
            <Unlink className="size-3.5" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Desfazer" onClick={() => exec("undo")}>
            <Undo className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Refazer" onClick={() => exec("redo")}>
            <Redo className="size-3.5" />
          </ToolbarButton>
        </div>

        {/* Área editável — estilos nativos do browser, sem Tailwind */}
        <style>{`
          .rte-editor ul { list-style-type: disc; padding-left: 1.5em; margin: 0.5em 0; }
          .rte-editor ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
          .rte-editor li { margin: 0.25em 0; display: list-item; }
          .rte-editor a  { color: #2563eb; text-decoration: underline; cursor: pointer; }
          .rte-editor b, .rte-editor strong { font-weight: bold; }
          .rte-editor i, .rte-editor em { font-style: italic; }
          .rte-editor u  { text-decoration: underline; }
          .rte-editor s, .rte-editor strike { text-decoration: line-through; }
        `}</style>

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
          className="rte-editor bg-background min-h-36 max-h-125 overflow-y-auto w-full rounded-b-xl px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        />
      </div>

      <textarea ref={hiddenRef} name={name} className="hidden" defaultValue={defaultValue} />
    </div>
  );
}