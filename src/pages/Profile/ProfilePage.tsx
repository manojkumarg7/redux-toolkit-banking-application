import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { PageHeader } from '../../components/common/Feedback';
import { FormField } from '../../components/forms/FormControls';
import {
  selectIsEditingProfile,
  selectProfile,
  setEditing,
  updateProfile,
} from '../../features/profile/profileSlice';
import { pushToast } from '../../features/ui/uiSlice';
import { formatDate } from '../../utils/formatters';
import { maskPhone } from '../../utils/masks';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const isEditing = useAppSelector(selectIsEditingProfile);
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startEdit = () => {
    setForm(profile);
    setErrors({});
    dispatch(setEditing(true));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.phone.trim()) next.phone = 'Phone is required.';
    if (!form.address.trim()) next.address = 'Address is required.';
    return next;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    dispatch(
      updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        avatar: form.name
          .trim()
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      }),
    );
    dispatch(pushToast({ type: 'success', message: 'Profile updated.' }));
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Manage your FinBank customer profile"
        actions={
          !isEditing ? (
            <button type="button" className="btn btn-primary btn-sm" onClick={startEdit}>
              Edit profile
            </button>
          ) : null
        }
      />

      <div className="row g-4">
        <div className="col-lg-4">
          <ContentCard>
            <div className="text-center py-3">
              <div className="profile-avatar mb-3">{profile.avatar}</div>
              <h2 className="h4 mb-1">{profile.name}</h2>
              <p className="text-muted mb-0">{profile.customerId}</p>
              <p className="small text-muted mt-2 mb-0">Member since {formatDate(profile.joinedAt)}</p>
            </div>
          </ContentCard>
        </div>
        <div className="col-lg-8">
          <ContentCard title="Personal information">
            {isEditing ? (
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField label="Name" htmlFor="profile-name" error={errors.name}>
                      <input
                        id="profile-name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </FormField>
                  </div>
                  <div className="col-md-6">
                    <FormField label="Email" htmlFor="profile-email" error={errors.email}>
                      <input
                        id="profile-email"
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </FormField>
                  </div>
                  <div className="col-md-6">
                    <FormField label="Phone" htmlFor="profile-phone" error={errors.phone}>
                      <input
                        id="profile-phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </FormField>
                  </div>
                  <div className="col-md-6">
                    <FormField label="Customer ID" htmlFor="profile-cid">
                      <input id="profile-cid" className="form-control" value={form.customerId} disabled />
                    </FormField>
                  </div>
                  <div className="col-12">
                    <FormField label="Address" htmlFor="profile-address" error={errors.address}>
                      <textarea
                        id="profile-address"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        rows={3}
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      />
                    </FormField>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => dispatch(setEditing(false))}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="detail-list mb-0">
                <div>
                  <dt>Name</dt>
                  <dd>{profile.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{maskPhone(profile.phone)}</dd>
                </div>
                <div>
                  <dt>Customer ID</dt>
                  <dd>{profile.customerId}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{profile.address}</dd>
                </div>
              </dl>
            )}
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
