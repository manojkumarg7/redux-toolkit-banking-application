import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { APP_NAME, DEMO_CREDENTIALS } from '../../constants';
import { ROUTES } from '../../constants/routes';
import { clearAuthError, loginUser } from '../../features/auth/authSlice';
import { IconEye, IconEyeOff } from '../../components/common/Icons';
import { FormField } from '../../components/forms/FormControls';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, status, error, rememberedIdentifier } = useAppSelector((state) => state.auth);

  const [identifier, setIdentifier] = useState(rememberedIdentifier || DEMO_CREDENTIALS.identifier);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedIdentifier));
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? ROUTES.dashboard;

  const isLoading = status === 'loading';

  const validation = useMemo(() => {
    const next: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) next.identifier = 'Customer ID or email is required.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    return next;
  }, [identifier, password]);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(clearAuthError());
    setFieldErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const result = await dispatch(
      loginUser({
        identifier: identifier.trim(),
        password,
        rememberMe,
      }),
    );

    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-brand mb-4">
          <span className="brand-mark large">F</span>
          <div>
            <h1 className="h3 mb-1">{APP_NAME}</h1>
            <p className="text-muted mb-0">Secure personal finance dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Customer ID / Email" htmlFor="identifier" error={fieldErrors.identifier}>
            <input
              id="identifier"
              className={`form-control ${fieldErrors.identifier ? 'is-invalid' : ''}`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              placeholder="CUST1001 or email"
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={fieldErrors.password}>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter demo password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </FormField>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                id="remember"
                className="form-check-input"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>
            <button type="button" className="btn btn-link btn-sm p-0" disabled>
              Forgot password?
            </button>
          </div>

          {error ? (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          ) : null}

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="demo-creds mt-4">
          <p className="small text-muted mb-1">Demo credentials (not real banking data)</p>
          <p className="small mb-0">
            ID: <code>{DEMO_CREDENTIALS.identifier}</code> · Password:{' '}
            <code>{DEMO_CREDENTIALS.password}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
