import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { PageHeader, Spinner } from '../../components/common/Feedback';
import { IconCheck } from '../../components/common/Icons';
import { FormField, SelectField } from '../../components/forms/FormControls';
import { TRANSFER_TYPES } from '../../constants';
import { ROUTES } from '../../constants/routes';
import { fetchAccounts, selectAccounts } from '../../features/accounts/accountSlice';
import {
  fetchBeneficiaries,
  selectBeneficiaries,
} from '../../features/beneficiaries/beneficiarySlice';
import {
  executeTransfer,
  resetTransfer,
  selectLastTransfer,
  selectTransferDraft,
  selectTransferError,
  selectTransferStatus,
  selectTransferStep,
  setTransferStep,
  updateTransferDraft,
} from '../../features/transfers/transferSlice';
import { pushToast } from '../../features/ui/uiSlice';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { maskAccountNumber } from '../../utils/masks';

export default function TransfersPage() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const beneficiaries = useAppSelector(selectBeneficiaries);
  const draft = useAppSelector(selectTransferDraft);
  const step = useAppSelector(selectTransferStep);
  const status = useAppSelector(selectTransferStatus);
  const error = useAppSelector(selectTransferError);
  const lastTransfer = useAppSelector(selectLastTransfer);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchBeneficiaries());
  }, [dispatch]);

  const selectedAccount = accounts.find((a) => a.id === draft.fromAccountId);
  const selectedBeneficiary = beneficiaries.find((b) => b.id === draft.beneficiaryId);
  const activeBeneficiaries = useMemo(
    () => beneficiaries.filter((b) => b.status === 'active'),
    [beneficiaries],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.fromAccountId) next.fromAccountId = 'Select a source account.';
    if (!draft.beneficiaryId) next.beneficiaryId = 'Select a beneficiary.';
    if (!draft.amount || draft.amount <= 0) next.amount = 'Enter a valid amount.';
    if (selectedAccount && draft.amount > selectedAccount.balance) {
      next.amount = 'Amount exceeds available balance.';
    }
    if (!draft.transferType) next.transferType = 'Select transfer type.';
    return next;
  };

  const handleContinue = (event: FormEvent) => {
    event.preventDefault();
    const next = validate();
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;
    dispatch(setTransferStep('confirm'));
  };

  const handleConfirm = async () => {
    const result = await dispatch(executeTransfer());
    if (executeTransfer.fulfilled.match(result)) {
      dispatch(pushToast({ type: 'success', message: 'Transfer completed successfully.' }));
    } else {
      dispatch(pushToast({ type: 'error', message: (result.payload as string) || 'Transfer failed.' }));
    }
  };

  if (accounts.length === 0) {
    return <Spinner label="Loading transfer form" />;
  }

  return (
    <div>
      <PageHeader
        title="Transfer Money"
        subtitle="Send funds to your saved beneficiaries using demo IMPS/NEFT/RTGS"
        actions={
          step !== 'form' ? (
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(resetTransfer())}>
              New transfer
            </button>
          ) : null
        }
      />

      <div className="transfer-steps mb-4">
        {(['form', 'confirm', 'success'] as const).map((item, index) => (
          <div key={item} className={`transfer-step ${step === item ? 'active' : ''} ${
            (step === 'confirm' && item === 'form') || step === 'success' ? 'done' : ''
          }`}>
            <span className="step-index">{index + 1}</span>
            <span className="text-capitalize">{item === 'form' ? 'Details' : item}</span>
          </div>
        ))}
      </div>

      {step === 'form' ? (
        <ContentCard title="Transfer details">
          <form onSubmit={handleContinue} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <SelectField
                  label="From account"
                  id="from-account"
                  value={draft.fromAccountId}
                  error={fieldErrors.fromAccountId}
                  onChange={(e) => dispatch(updateTransferDraft({ fromAccountId: e.target.value }))}
                  options={[
                    { value: '', label: 'Select account' },
                    ...accounts
                      .filter((a) => a.type !== 'fixed_deposit')
                      .map((account) => ({
                        value: account.id,
                        label: `${account.name} · ${formatCurrency(account.balance)}`,
                      })),
                  ]}
                />
              </div>
              <div className="col-md-6">
                <SelectField
                  label="Beneficiary"
                  id="beneficiary"
                  value={draft.beneficiaryId}
                  error={fieldErrors.beneficiaryId}
                  onChange={(e) => dispatch(updateTransferDraft({ beneficiaryId: e.target.value }))}
                  options={[
                    { value: '', label: 'Select beneficiary' },
                    ...activeBeneficiaries.map((ben) => ({
                      value: ben.id,
                      label: `${ben.name} · ${ben.bank}`,
                    })),
                  ]}
                />
                <Link to={ROUTES.beneficiaries} className="small">
                  Manage beneficiaries
                </Link>
              </div>
              <div className="col-md-4">
                <FormField label="Amount (INR)" htmlFor="amount" error={fieldErrors.amount}>
                  <input
                    id="amount"
                    type="number"
                    min={1}
                    step="0.01"
                    className={`form-control ${fieldErrors.amount ? 'is-invalid' : ''}`}
                    value={draft.amount || ''}
                    onChange={(e) =>
                      dispatch(updateTransferDraft({ amount: Number(e.target.value) }))
                    }
                  />
                </FormField>
              </div>
              <div className="col-md-4">
                <SelectField
                  label="Transfer type"
                  id="transfer-type"
                  value={draft.transferType}
                  error={fieldErrors.transferType}
                  onChange={(e) =>
                    dispatch(
                      updateTransferDraft({
                        transferType: e.target.value as typeof draft.transferType,
                      }),
                    )
                  }
                  options={TRANSFER_TYPES.map((type) => ({ value: type, label: type }))}
                />
              </div>
              <div className="col-md-4">
                <FormField label="Description" htmlFor="description">
                  <input
                    id="description"
                    className="form-control"
                    value={draft.description}
                    onChange={(e) => dispatch(updateTransferDraft({ description: e.target.value }))}
                    placeholder="Optional note"
                  />
                </FormField>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Continue to confirmation
            </button>
          </form>
        </ContentCard>
      ) : null}

      {step === 'confirm' ? (
        <ContentCard title="Confirm transfer">
          <dl className="detail-list mb-4">
            <div>
              <dt>From</dt>
              <dd>
                {selectedAccount?.name} ({maskAccountNumber(selectedAccount?.accountNumber ?? '')})
              </dd>
            </div>
            <div>
              <dt>To</dt>
              <dd>
                {selectedBeneficiary?.name} · {selectedBeneficiary?.bank}
              </dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>{formatCurrency(draft.amount)}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{draft.transferType}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{draft.description || '—'}</dd>
            </div>
          </dl>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => dispatch(setTransferStep('form'))}
              disabled={status === 'loading'}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Processing...' : 'Confirm & Transfer'}
            </button>
          </div>
        </ContentCard>
      ) : null}

      {step === 'success' && lastTransfer ? (
        <ContentCard>
          <div className="text-center py-4">
            <div className="success-icon mb-3">
              <IconCheck size={28} />
            </div>
            <h2 className="h4">Transfer successful</h2>
            <p className="text-muted">
              {formatCurrency(lastTransfer.amount)} sent via {lastTransfer.transferType}
            </p>
            <p className="font-monospace">Ref: {lastTransfer.reference}</p>
            <p className="small text-muted">{formatDateTime(lastTransfer.createdAt)}</p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button type="button" className="btn btn-primary" onClick={() => dispatch(resetTransfer())}>
                Make another transfer
              </button>
              <Link to={ROUTES.transactions} className="btn btn-outline-secondary">
                View transactions
              </Link>
            </div>
          </div>
        </ContentCard>
      ) : null}
    </div>
  );
}
