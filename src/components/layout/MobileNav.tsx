import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import {
  IconCalculator,
  IconHome,
  IconTransactions,
  IconTransfer,
  IconWallet,
} from '../common/Icons';

const items = [
  { to: ROUTES.dashboard, label: 'Home', icon: IconHome, end: true },
  { to: ROUTES.accounts, label: 'Accounts', icon: IconWallet },
  { to: ROUTES.transfers, label: 'Transfer', icon: IconTransfer },
  { to: ROUTES.transactions, label: 'Activity', icon: IconTransactions },
  { to: ROUTES.calculators, label: 'Tools', icon: IconCalculator },
];

export function MobileNav() {
  return (
    <nav className="mobile-nav d-lg-none" aria-label="Mobile navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
