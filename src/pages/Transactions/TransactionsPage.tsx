import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentCard } from '../../components/cards/StatCard';
import { EmptyState, ErrorState, PageHeader, Spinner } from '../../components/common/Feedback';
import { FormField, SelectField } from '../../components/forms/FormControls';
import { TransactionTable } from '../../components/tables/TransactionTable';
import { PAGE_SIZE, TRANSACTION_CATEGORIES } from '../../constants';
import {
  fetchTransactions,
  resetTransactionFilters,
  selectFilteredTransactions,
  selectTransactionFilters,
  setTransactionFilters,
} from '../../features/transactions/transactionSlice';

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.transactions.status);
  const error = useAppSelector((s) => s.transactions.error);
  const filters = useAppSelector(selectTransactionFilters);
  const filtered = useAppSelector(selectFilteredTransactions);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchTransactions());
  }, [dispatch, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  if (status === 'loading') return <Spinner label="Loading transactions" />;
  if (status === 'failed') {
    return (
      <ErrorState message={error ?? 'Failed to load transactions'} onRetry={() => dispatch(fetchTransactions())} />
    );
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Search, filter, and review your account activity"
        actions={
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => dispatch(resetTransactionFilters())}
          >
            Reset filters
          </button>
        }
      />

      <ContentCard className="mb-4">
        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-4">
            <FormField label="Search" htmlFor="txn-search">
              <input
                id="txn-search"
                className="form-control"
                value={filters.search}
                onChange={(e) => dispatch(setTransactionFilters({ search: e.target.value }))}
                placeholder="Description, ID, category"
              />
            </FormField>
          </div>
          <div className="col-6 col-md-3 col-xl-2">
            <SelectField
              label="Type"
              id="txn-type"
              value={filters.type}
              onChange={(e) =>
                dispatch(setTransactionFilters({ type: e.target.value as typeof filters.type }))
              }
              options={[
                { value: 'all', label: 'All' },
                { value: 'credit', label: 'Credit' },
                { value: 'debit', label: 'Debit' },
              ]}
            />
          </div>
          <div className="col-6 col-md-3 col-xl-2">
            <SelectField
              label="Category"
              id="txn-category"
              value={filters.category}
              onChange={(e) => dispatch(setTransactionFilters({ category: e.target.value }))}
              options={[
                { value: 'all', label: 'All' },
                ...TRANSACTION_CATEGORIES.map((category) => ({ value: category, label: category })),
              ]}
            />
          </div>
          <div className="col-6 col-md-4 col-xl-2">
            <FormField label="From" htmlFor="txn-from">
              <input
                id="txn-from"
                type="date"
                className="form-control"
                value={filters.dateFrom}
                onChange={(e) => dispatch(setTransactionFilters({ dateFrom: e.target.value }))}
              />
            </FormField>
          </div>
          <div className="col-6 col-md-4 col-xl-2">
            <FormField label="To" htmlFor="txn-to">
              <input
                id="txn-to"
                type="date"
                className="form-control"
                value={filters.dateTo}
                onChange={(e) => dispatch(setTransactionFilters({ dateTo: e.target.value }))}
              />
            </FormField>
          </div>
          <div className="col-12 col-md-4 col-xl-3">
            <SelectField
              label="Sort by"
              id="txn-sort"
              value={`${filters.sortBy}-${filters.sortDir}`}
              onChange={(e) => {
                const [sortBy, sortDir] = e.target.value.split('-') as [
                  'date' | 'amount',
                  'asc' | 'desc',
                ];
                dispatch(setTransactionFilters({ sortBy, sortDir }));
              }}
              options={[
                { value: 'date-desc', label: 'Date (Newest)' },
                { value: 'date-asc', label: 'Date (Oldest)' },
                { value: 'amount-desc', label: 'Amount (High to Low)' },
                { value: 'amount-asc', label: 'Amount (Low to High)' },
              ]}
            />
          </div>
        </div>
      </ContentCard>

      <ContentCard>
        {paged.length === 0 ? (
          <EmptyState title="No transactions found" description="Try adjusting your filters." />
        ) : (
          <>
            <TransactionTable transactions={paged} />
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2 pagination-bar">
              <span className="small text-muted">
                Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </span>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => dispatch(setTransactionFilters({ page: page - 1 }))}
                >
                  Previous
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
                  Page {page} / {totalPages}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => dispatch(setTransactionFilters({ page: page + 1 }))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </ContentCard>
    </div>
  );
}
