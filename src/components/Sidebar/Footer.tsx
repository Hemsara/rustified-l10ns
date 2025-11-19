export const Footer = () => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
      <div className="flex items-center gap-2 mb-2">
        <img
          src="https://rustacean.net/assets/rustacean-flat-happy.png"
          alt="Rustacean"
          className="w-5 h-5"
        />
        <p className="text-xs" style={{ color: "#CE422B" }}>
          Powered by <span className="font-medium">Rust</span>
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Vehan Hemsara trying to learn Rust
      </p>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <img
            src="https://images.seeklogo.com/logo-png/30/2/github-logo-png_seeklogo-304612.png"
            alt="GitHub"
            className="w-5 h-5 dark:invert"
          />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <img
            src="https://icons.veryicon.com/png/o/miscellaneous/offerino-icons/instagram-53.png"
            alt="Instagram"
            className="w-5 h-5"
          />
        </a>
      </div>
    </div>
  );
};
