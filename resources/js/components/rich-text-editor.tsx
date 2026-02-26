import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({
  name,
  label,
  defaultValue = "",
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const hiddenRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = defaultValue || "";
    }
    if (hiddenRef.current) {
      hiddenRef.current.value = defaultValue || "";
    }
  }, [defaultValue]);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const handleInput = () => {
    if (!editorRef.current || !hiddenRef.current) return;
    hiddenRef.current.value = editorRef.current.innerHTML;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}

      <div className="bg-muted flex items-center gap-1 rounded-md border px-2 py-1">
        <button
          type="button"
          className="px-2 py-1 text-sm font-semibold"
          onClick={() => exec("bold")}
        >
          B
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm italic"
          onClick={() => exec("italic")}
        >
          I
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm underline"
          onClick={() => exec("underline")}
        >
          U
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm"
          onClick={() => exec("insertUnorderedList")}
        >
          • Lista
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm"
          onClick={() => exec("insertOrderedList")}
        >
          1. Lista
        </button>
        <div className="ml-2 h-5 w-px border-l bg-white" />

        <button
          type="button"
          className="px-2 py-1 text-xs"
          onClick={() => exec("justifyLeft")}
        >
          Left
        </button>
        <button
          type="button"
          className="px-2 py-1 text-xs"
          onClick={() => exec("justifyCenter")}
        >
          Center
        </button>
        <button
          type="button"
          className="px-2 py-1 text-xs"
          onClick={() => exec("justifyRight")}
        >
          Right
        </button>
        <button
          type="button"
          className="px-2 py-1 text-xs"
          onClick={() => exec("justifyFull")}
        >
          Justify
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "bg-background focus-visible:ring-ring min-h-30 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none",
          "prose prose-sm prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4",
        )}
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
      />

      <textarea
        ref={hiddenRef}
        name={name}
        className="hidden"
        defaultValue={defaultValue}
      />
    </div>
  );
}

