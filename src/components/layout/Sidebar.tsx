import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import { selectSidebarOpen, setSidebarOpen } from '../../features/ui/uiSlice';
import {
  IconCalculator,
  IconClose,
  IconDashboard,
  IconLogout,
  IconSettings,
  IconTransactions,
  IconTransfer,
  IconUser,
  IconUsers,
  IconWallet,
} from '../common/Icons';
import { APP_NAME } from '../../constants';

const navItems = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: IconDashboard },
  { to: ROUTES.accounts, label: 'Accounts', icon: IconWallet },
  { to: ROUTES.transactions, label: 'Transactions', icon: IconTransactions },
  { to: ROUTES.transfers, label: 'Transfers', icon: IconTransfer },
  { to: ROUTES.calculators, label: 'Calculators', icon: IconCalculator },
  { to: ROUTES.beneficiaries, label: 'Beneficiaries', icon: IconUsers },
  { to: ROUTES.profile, label: 'Profile', icon: IconUser },
  { to: ROUTES.settings, label: 'Settings', icon: IconSettings },
];

export function Sidebar() {
  const open = useAppSelector(selectSidebarOpen);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) {
        dispatch(setSidebarOpen(false));
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = open && window.innerWidth < 992 ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.login);
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'show' : ''}`}
        onClick={() => dispatch(setSidebarOpen(false))}
        aria-hidden={!open}
      />
      <aside className={`app-sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-brand d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="brand-mark">F</span>
            <div>
              <strong className="d-block">{APP_NAME}</strong>
              <small className="text-muted">Personal Finance</small>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light d-lg-none"
            aria-label="Close menu"
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <IconClose size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.dashboard}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => dispatch(setSidebarOpen(false))}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button type="button" className="sidebar-link logout-link" onClick={handleLogout}>
          <IconLogout size={18} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
