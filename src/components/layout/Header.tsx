import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ROUTES } from '../../constants/routes';
import { logoutUser } from '../../features/auth/authSlice';
import { selectProfile } from '../../features/profile/profileSlice';
import {
  markAllNotificationsRead,
  markNotificationRead,
  selectGlobalSearch,
  selectNotifications,
  selectUnreadCount,
  setGlobalSearch,
  setSidebarOpen,
  toggleSidebar,
} from '../../features/ui/uiSlice';
import { formatDateTime } from '../../utils/formatters';
import { IconBell, IconMenu, IconSearch } from '../common/Icons';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);
  const notifications = useAppSelector(selectNotifications);
  const unread = useAppSelector(selectUnreadCount);
  const search = useAppSelector(selectGlobalSearch);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.login);
  };

  return (
    <header className="app-header">
      <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
        <button
          type="button"
          className="btn btn-light d-lg-none flex-shrink-0"
          aria-label="Open menu"
          onClick={() => dispatch(toggleSidebar())}
        >
          <IconMenu size={18} />
        </button>
        <div className="header-welcome">
          <p className="mb-0 text-muted small d-none d-sm-block">Welcome back</p>
          <h2 className="h5 mb-0">{profile.name}</h2>
        </div>
      </div>

      <div className="header-actions d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
        <label className="header-search d-none d-md-flex">
          <IconSearch size={16} />
          <input
            type="search"
            className="form-control form-control-sm border-0"
            placeholder="Search accounts, transfers..."
            value={search}
            onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
            aria-label="Global search"
          />
        </label>

        <div className="dropdown-wrap" ref={notifRef}>
          <button
            type="button"
            className="icon-btn"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((v) => !v)}
          >
            <IconBell size={18} />
            {unread > 0 ? <span className="notif-dot">{unread}</span> : null}
          </button>
          {notifOpen ? (
            <div className="dropdown-panel notifications-panel">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Notifications</strong>
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0"
                  onClick={() => dispatch(markAllNotificationsRead())}
                >
                  Mark all read
                </button>
              </div>
              <ul className="list-unstyled mb-0">
                {notifications.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`notif-item ${item.read ? '' : 'unread'}`}
                      onClick={() => dispatch(markNotificationRead(item.id))}
                    >
                      <strong className="d-block">{item.title}</strong>
                      <span className="small text-muted d-block">{item.message}</span>
                      <span className="tiny text-muted">{formatDateTime(item.createdAt)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="dropdown-wrap" ref={menuRef}>
          <button
            type="button"
            className="avatar-btn"
            aria-label="Profile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="avatar-circle">{profile.avatar}</span>
          </button>
          {menuOpen ? (
            <div className="dropdown-panel profile-panel">
              <p className="mb-1 fw-semibold">{profile.name}</p>
              <p className="small text-muted mb-3">{profile.email}</p>
              <Link
                to={ROUTES.profile}
                className="dropdown-link"
                onClick={() => {
                  setMenuOpen(false);
                  dispatch(setSidebarOpen(false));
                }}
              >
                Profile
              </Link>
              <Link
                to={ROUTES.settings}
                className="dropdown-link"
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>
              <button type="button" className="dropdown-link text-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="header-mobile-search d-md-none">
        <label className="header-search d-flex">
          <IconSearch size={16} />
          <input
            type="search"
            className="form-control form-control-sm border-0"
            placeholder="Search..."
            value={search}
            onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
            aria-label="Global search"
          />
        </label>
      </div>
    </header>
  );
}
