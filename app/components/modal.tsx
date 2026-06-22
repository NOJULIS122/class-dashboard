"use client";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19407a]/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#d9eefb] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#d9eefb] bg-[#f7fcff] px-6 py-4">
          <h2 className="text-xl font-extrabold text-[#19407a]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xl text-[#849aaa] hover:bg-[#eaf7ff]"
            aria-label="Uždaryti"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
