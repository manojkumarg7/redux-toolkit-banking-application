import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectSettings } from '../../features/ui/uiSlice';
import { ToastStack } from '../common/ToastStack';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const settings = useAppSelector(selectSettings);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('theme-dark', settings.darkMode);
    root.classList.toggle('theme-light', !settings.darkMode);
    root.style.colorScheme = settings.darkMode ? 'dark' : 'light';

    return () => {
      root.classList.remove('theme-dark', 'theme-light');
      root.style.colorScheme = '';
    };
  }, [settings.darkMode]);

  return (
    <div className={`app-shell ${settings.darkMode ? 'theme-dark' : 'theme-light'}`}>
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <ToastStack />
    </div>
  );
}
