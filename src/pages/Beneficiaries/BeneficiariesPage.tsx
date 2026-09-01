import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { EmptyState, ErrorState, PageHeader, Spinner, StatusBadge } from '../../components/common/Feedback';
import { FormField } from '../../components/forms/FormControls';
import {
  addBeneficiary,
  editBeneficiary,
  fetchBeneficiaries,
  removeBeneficiary,
  selectFilteredBeneficiaries,
  setBeneficiarySearch,
} from '../../features/beneficiaries/beneficiarySlice';
import { pushToast } from '../../features/ui/uiSlice';
import type { Beneficiary } from '../../types';
import { maskAccountNumber } from '../../utils/masks';

const emptyForm = {
  name: '',
  bank: '',
  accountNumber: '',
  ifsc: '',
  nickname: '',
};

export default function BeneficiariesPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFilteredBeneficiaries);
  const search = useAppSelector((s) => s.beneficiaries.search);
  const status = useAppSelector((s) => s.beneficiaries.status);
  const error = useAppSelector((s) => s.beneficiaries.error);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Beneficiary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'idle') dispatch(fetchBeneficiaries());
  }, [dispatch, status]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.bank.trim()) next.bank = 'Bank is required.';
    if (!/^\d{9,18}$/.test(form.accountNumber.replace(/\s/g, ''))) {
      next.accountNumber = 'Enter a valid demo account number (9-18 digits).';
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.ifsc.trim())) {
      next.ifsc = 'Enter a valid IFSC format.';
    }
    return next;
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (beneficiary: Beneficiary) => {
    setEditing(beneficiary);
    setForm({
      name: beneficiary.name,
      bank: beneficiary.bank,
      accountNumber: beneficiary.accountNumber,
      ifsc: beneficiary.ifsc,
      nickname: beneficiary.nickname ?? '',
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next = validate();
    setFormErrors(next);
    if (Object.keys(next).length > 0) return;

    if (editing) {
      const result = await dispatch(
        editBeneficiary({
          ...editing,
          ...form,
          accountNumber: form.accountNumber.replace(/\s/g, ''),
          ifsc: form.ifsc.toUpperCase(),
        }),
      );
      if (editBeneficiary.fulfilled.match(result)) {
        dispatch(pushToast({ type: 'success', message: 'Beneficiary updated.' }));
        setShowForm(false);
      }
      return;
    }

    const result = await dispatch(
      addBeneficiary({
        ...form,
        accountNumber: form.accountNumber.replace(/\s/g, ''),
        ifsc: form.ifsc.toUpperCase(),
        status: 'pending',
      }),
    );
    if (addBeneficiary.fulfilled.match(result)) {
      dispatch(pushToast({ type: 'success', message: 'Beneficiary added.' }));
      setShowForm(false);
      setForm(emptyForm);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this beneficiary?');
    if (!confirmed) return;
    const result = await dispatch(removeBeneficiary(id));
    if (removeBeneficiary.fulfilled.match(result)) {
      dispatch(pushToast({ type: 'info', message: 'Beneficiary deleted.' }));
    }
  };

  if (status === 'loading') return <Spinner label="Loading beneficiaries" />;
  if (status === 'failed') {
    return (
      <ErrorState message={error ?? 'Failed to load beneficiaries'} onRetry={() => dispatch(fetchBeneficiaries())} />
    );
  }

  return (
    <div>
      <PageHeader
        title="Beneficiaries"
        subtitle="Manage people and accounts you transfer money to"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            Add beneficiary
          </button>
        }
      />

      <ContentCard className="mb-4">
        <FormField label="Search beneficiaries" htmlFor="ben-search">
          <input
            id="ben-search"
            className="form-control"
            value={search}
            onChange={(e) => dispatch(setBeneficiarySearch(e.target.value))}
            placeholder="Name, bank, IFSC..."
          />
        </FormField>
      </ContentCard>

      {showForm ? (
        <ContentCard title={editing ? 'Edit beneficiary' : 'Add beneficiary'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <FormField label="Name" htmlFor="ben-name" error={formErrors.name}>
                  <input
                    id="ben-name"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Bank" htmlFor="ben-bank" error={formErrors.bank}>
                  <input
                    id="ben-bank"
                    className={`form-control ${formErrors.bank ? 'is-invalid' : ''}`}
                    value={form.bank}
                    onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))}
                  />
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField label="Account number" htmlFor="ben-account" error={formErrors.accountNumber}>
                  <input
                    id="ben-account"
                    className={`form-control ${formErrors.accountNumber ? 'is-invalid' : ''}`}
                    value={form.accountNumber}
                    onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                    inputMode="numeric"
                  />
                </FormField>
              </div>
              <div className="col-md-3">
                <FormField label="IFSC" htmlFor="ben-ifsc" error={formErrors.ifsc}>
                  <input
                    id="ben-ifsc"
                    className={`form-control ${formErrors.ifsc ? 'is-invalid' : ''}`}
                    value={form.ifsc}
                    onChange={(e) => setForm((f) => ({ ...f, ifsc: e.target.value.toUpperCase() }))}
                  />
                </FormField>
              </div>
              <div className="col-md-3">
                <FormField label="Nickname" htmlFor="ben-nick">
                  <input
                    id="ben-nick"
                    className="form-control"
                    value={form.nickname}
                    onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                  />
                </FormField>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editing ? 'Save changes' : 'Add beneficiary'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </ContentCard>
      ) : null}

      <ContentCard>
        {items.length === 0 ? (
          <EmptyState title="No beneficiaries found" description="Add a beneficiary to start transferring." />
        ) : (
          <>
            <div className="table-responsive d-none d-md-block">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Bank</th>
                    <th scope="col">Account</th>
                    <th scope="col">IFSC</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.nickname ? <div className="small text-muted">{item.nickname}</div> : null}
                      </td>
                      <td>{item.bank}</td>
                      <td className="font-monospace">{maskAccountNumber(item.accountNumber)}</td>
                      <td>{item.ifsc}</td>
                      <td>
                        <StatusBadge
                          variant={
                            item.status === 'active'
                              ? 'success'
                              : item.status === 'pending'
                                ? 'warning'
                                : 'secondary'
                          }
                        >
                          {item.status}
                        </StatusBadge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-md-none">
              {items.map((item) => (
                <article key={item.id} className="beneficiary-card">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <strong className="d-block">{item.name}</strong>
                      {item.nickname ? <span className="small text-muted">{item.nickname}</span> : null}
                    </div>
                    <StatusBadge
                      variant={
                        item.status === 'active'
                          ? 'success'
                          : item.status === 'pending'
                            ? 'warning'
                            : 'secondary'
                      }
                    >
                      {item.status}
                    </StatusBadge>
                  </div>
                  <p className="mb-1 small">{item.bank}</p>
                  <p className="mb-1 font-monospace small">{maskAccountNumber(item.accountNumber)}</p>
                  <p className="mb-3 small text-muted">IFSC: {item.ifsc}</p>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary flex-fill"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger flex-fill"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </ContentCard>
    </div>
  );
}
