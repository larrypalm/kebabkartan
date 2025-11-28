'use client';

export default function CookieSettingsButton() {
  const handleClick = () => {
    // This would trigger cookie settings modal
    // For now, just a placeholder
    alert('Cookie-inställningar kommer snart! För närvarande kan du hantera cookies via din webbläsare.');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium"
    >
      Öppna cookie-inställningar
    </button>
  );
}
