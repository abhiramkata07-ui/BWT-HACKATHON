import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MetricCard from '../components/ui/MetricCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { Activity } from 'lucide-react';

describe('Frontend UI Components', () => {
  it('MetricCard renders title, value, and unit', () => {
    render(
      <MetricCard
        icon={Activity}
        title="Calories Burned"
        value="520"
        unit="kcal"
      />
    );
    expect(screen.getByText('Calories Burned')).toBeDefined();
    expect(screen.getByText('520')).toBeDefined();
    expect(screen.getByText('kcal')).toBeDefined();
  });

  it('LoadingSpinner renders provided text', () => {
    render(<LoadingSpinner text="Fetching workout data..." />);
    expect(screen.getByText('Fetching workout data...')).toBeDefined();
  });

  it('EmptyState renders title and action button', () => {
    render(
      <BrowserRouter>
        <EmptyState
          title="No Activities Logged"
          description="Please add your first workout."
          actionLabel="Log Workout"
          actionLink="/activities/new"
        />
      </BrowserRouter>
    );
    expect(screen.getByText('No Activities Logged')).toBeDefined();
    expect(screen.getByText('Log Workout')).toBeDefined();
  });

  it('Modal renders title and confirm button when open', () => {
    render(
      <Modal
        isOpen={true}
        title="Delete Workout"
        message="Are you sure you want to delete this workout?"
        confirmText="Confirm Delete"
        onConfirm={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Delete Workout')).toBeDefined();
    expect(screen.getByText('Confirm Delete')).toBeDefined();
  });
});
