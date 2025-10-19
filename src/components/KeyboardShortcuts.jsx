import { useState, useEffect } from "react";
import { X, HelpCircle } from "lucide-react";

export default function KeyboardShortcuts({ isDarkMode = true }) {
  const [isOpen, setIsOpen] = useState(false);

  // Handle ESC key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (e.target === e.currentTarget) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const shortcuts = [
    {
      category: "Cơ bản",
      items: [
        { key: "0-9", desc: "Nhập số" },
        { key: ".", desc: "Dấu thập phân" },
        { key: "+", desc: "Cộng" },
        { key: "-", desc: "Trừ" },
        { key: "*", desc: "Nhân" },
        { key: "/", desc: "Chia" },
        { key: "Enter", desc: "Bằng" },
        { key: "Esc", desc: "Xóa tất cả" },
        { key: "Del", desc: "Xóa entry" },
        { key: "Backspace", desc: "Xóa số cuối" },
      ],
    },
    {
      category: "Nâng cao",
      items: [
        { key: "S", desc: "Căn bậc hai" },
        { key: "X", desc: "Bình phương" },
        { key: "R", desc: "Nghịch đảo" },
        { key: "%", desc: "Phần trăm" },
        { key: "N", desc: "Đổi dấu" },
      ],
    },
    {
      category: "Bộ nhớ",
      items: [
        { key: "Ctrl + M", desc: "Lưu vào bộ nhớ" },
        { key: "Ctrl + R", desc: "Gọi từ bộ nhớ" },
        { key: "Ctrl + P", desc: "Cộng vào bộ nhớ" },
        { key: "Ctrl + Q", desc: "Trừ khỏi bộ nhớ" },
        { key: "Ctrl + L", desc: "Xóa bộ nhớ" },
      ],
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-lg transition-all duration-150 ${
          isDarkMode
            ? "hover:bg-slate-700/50 text-slate-300"
            : "hover:bg-gray-100/50 text-gray-600"
        }`}
        aria-label="Hiển thị phím tắt"
        title="Phím tắt"
      >
        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <div
        className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-xl ${
          isDarkMode
            ? "bg-slate-800 border border-slate-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Phím tắt bàn phím
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded-lg transition-all duration-150 ${
              isDarkMode
                ? "hover:bg-slate-700/50 text-slate-300"
                : "hover:bg-gray-100/50 text-gray-600"
            }`}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {shortcuts.map((category, index) => (
            <div key={index}>
              <h3
                className={`text-sm font-medium mb-3 ${
                  isDarkMode ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                {category.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex items-center justify-between p-2 rounded ${
                      isDarkMode
                        ? "bg-slate-700/30 hover:bg-slate-700/50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {item.desc}
                    </span>
                    <kbd
                      className={`px-2 py-1 text-xs font-mono rounded ${
                        isDarkMode
                          ? "bg-slate-600 text-slate-200 border border-slate-500"
                          : "bg-gray-200 text-gray-700 border border-gray-300"
                      }`}
                    >
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t text-center ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <p
            className={`text-xs ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Nhấn Esc hoặc click bên ngoài để đóng
          </p>
        </div>
      </div>
    </div>
  );
}
