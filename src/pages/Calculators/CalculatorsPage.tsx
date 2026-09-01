import { Link } from 'react-router-dom';
import { ContentCard } from '../../components/cards/StatCard';
import { PageHeader } from '../../components/common/Feedback';
import { IconCalculator, IconLandmark, IconPiggy, IconTrendUp, IconWallet } from '../../components/common/Icons';
import { ROUTES } from '../../constants/routes';

const calculators = [
  {
    title: 'Simple Interest',
    description: 'Calculate interest earned on a principal over time at a fixed rate.',
    to: ROUTES.simpleInterest,
    icon: IconTrendUp,
  },
  {
    title: 'Compound Interest',
    description: 'Estimate growth with compounding annually, quarterly, or monthly.',
    to: ROUTES.compoundInterest,
    icon: IconCalculator,
  },
  {
    title: 'Loan EMI',
    description: 'Compute monthly EMI, total interest, and amortization schedule.',
    to: ROUTES.loanEmi,
    icon: IconWallet,
  },
  {
    title: 'Fixed Deposit',
    description: 'Project FD maturity amount and yearly growth for your deposit.',
    to: ROUTES.fixedDeposit,
    icon: IconLandmark,
  },
  {
    title: 'Recurring Deposit',
    description: 'Estimate RD maturity from monthly contributions and tenure.',
    to: ROUTES.recurringDeposit,
    icon: IconPiggy,
  },
];

export default function CalculatorsPage() {
  return (
    <div>
      <PageHeader
        title="Financial Calculators"
        subtitle="Plan savings, deposits, and loans with reusable calculation tools"
      />
      <div className="row g-4">
        {calculators.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.to} className="col-md-6 col-xl-4">
              <ContentCard>
                <div className="calculator-card-icon mb-3">
                  <Icon size={22} />
                </div>
                <h2 className="h5">{item.title}</h2>
                <p className="text-muted">{item.description}</p>
                <Link to={item.to} className="btn btn-primary btn-sm">
                  Open Calculator
                </Link>
              </ContentCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
