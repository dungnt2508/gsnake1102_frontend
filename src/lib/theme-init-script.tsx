const getInitScript = () => `
  (function() {
    try {
      var stored = window.localStorage.getItem('theme') || 'dark';
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var resolved = stored === 'system' ? (systemDark ? 'dark' : 'light') : stored;
      var root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    } catch (e) {
      // Fallback: keep current class if access fails
    }
  })();
`;

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: getInitScript() }} />;
}

