import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { PageHeader } from '../../components/common/Feedback';
import { SelectField } from '../../components/forms/FormControls';
import { LANGUAGES } from '../../constants';
import { pushToast, selectSettings, updateSettings } from '../../features/ui/uiSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const toggle = (key: keyof typeof settings, label: string) => {
    const next = !settings[key];
    dispatch(updateSettings({ [key]: next }));
    dispatch(
      pushToast({
        type: 'success',
        message: `${label} ${next ? 'enabled' : 'disabled'}.`,
      }),
    );
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Security, notifications, and application preferences" />

      <div className="row g-4">
        <div className="col-lg-4">
          <ContentCard title="Security">
            <p className="text-muted small">
              This is a demo banking UI. Real authentication, OTPs, and credentials are never collected.
            </p>
            <ul className="list-unstyled mb-0 settings-list">
              <li>Session stored locally for demo convenience</li>
              <li>Account numbers are masked in the UI</li>
              <li>Use demo credentials only</li>
            </ul>
          </ContentCard>
        </div>

        <div className="col-lg-4">
          <ContentCard title="Notifications">
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="email-notifications"
                checked={settings.emailNotifications}
                onChange={() => toggle('emailNotifications', 'Email notifications')}
              />
              <label className="form-check-label" htmlFor="email-notifications">
                Email notifications
              </label>
            </div>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="txn-notifications"
                checked={settings.transactionNotifications}
                onChange={() => toggle('transactionNotifications', 'Transaction notifications')}
              />
              <label className="form-check-label" htmlFor="txn-notifications">
                Transaction notifications
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="login-alerts"
                checked={settings.loginAlerts}
                onChange={() => toggle('loginAlerts', 'Login alerts')}
              />
              <label className="form-check-label" htmlFor="login-alerts">
                Login alerts
              </label>
            </div>
          </ContentCard>
        </div>

        <div className="col-lg-4">
          <ContentCard title="Preferences">
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="dark-mode"
                checked={settings.darkMode}
                onChange={() => toggle('darkMode', 'Dark mode')}
              />
              <label className="form-check-label" htmlFor="dark-mode">
                Dark mode
              </label>
            </div>
            <SelectField
              label="Language"
              id="language"
              value={settings.language}
              onChange={(e) => {
                dispatch(updateSettings({ language: e.target.value }));
                dispatch(pushToast({ type: 'info', message: 'Language preference saved.' }));
              }}
              options={LANGUAGES.map((lang) => ({ value: lang.value, label: lang.label }))}
            />
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
