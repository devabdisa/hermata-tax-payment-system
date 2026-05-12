import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageShell } from './page-shell';

describe('PageShell', () => {
  it('renders children correctly', () => {
    render(
      <PageShell>
        <div>Test Content</div>
      </PageShell>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default props when not specified', () => {
    const { container } = render(
      <PageShell>
        <div>Content</div>
      </PageShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-background'); // default background
    
    const contentContainer = wrapper.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-full'); // default maxWidth
    expect(contentContainer).toHaveClass('p-6'); // default padding (md)
  });

  it('applies sm max-width correctly', () => {
    const { container } = render(
      <PageShell maxWidth="sm">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-screen-sm');
  });

  it('applies md max-width correctly', () => {
    const { container } = render(
      <PageShell maxWidth="md">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-screen-md');
  });

  it('applies lg max-width correctly', () => {
    const { container } = render(
      <PageShell maxWidth="lg">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-screen-lg');
  });

  it('applies xl max-width correctly', () => {
    const { container } = render(
      <PageShell maxWidth="xl">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-screen-xl');
  });

  it('applies 2xl max-width correctly', () => {
    const { container } = render(
      <PageShell maxWidth="2xl">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-screen-2xl');
  });

  it('applies full max-width correctly', () => {
    const { container } = render(
      <PageShell maxWidth="full">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-full');
  });

  it('applies default background correctly', () => {
    const { container } = render(
      <PageShell background="default">
        <div>Content</div>
      </PageShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-background');
  });

  it('applies gradient background correctly', () => {
    const { container } = render(
      <PageShell background="gradient">
        <div>Content</div>
      </PageShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-gradient-to-br');
    expect(wrapper).toHaveClass('from-background');
    expect(wrapper).toHaveClass('via-background-secondary');
    expect(wrapper).toHaveClass('to-background');
  });

  it('applies glow background with radial effects', () => {
    const { container } = render(
      <PageShell background="glow">
        <div>Content</div>
      </PageShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-background');
    expect(wrapper).toHaveClass('relative');

    // Check for glow effect elements
    const glowContainer = wrapper.querySelector('.pointer-events-none');
    expect(glowContainer).toBeInTheDocument();
    
    const glowEffects = wrapper.querySelectorAll('.blur-3xl');
    expect(glowEffects).toHaveLength(2); // Two radial glow effects
  });

  it('applies sm padding correctly', () => {
    const { container } = render(
      <PageShell padding="sm">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('p-4');
  });

  it('applies md padding correctly', () => {
    const { container } = render(
      <PageShell padding="md">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('p-6');
  });

  it('applies lg padding correctly', () => {
    const { container } = render(
      <PageShell padding="lg">
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('p-8');
  });

  it('applies custom className correctly', () => {
    const { container } = render(
      <PageShell className="custom-class">
        <div>Content</div>
      </PageShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('combines multiple props correctly', () => {
    const { container } = render(
      <PageShell maxWidth="xl" background="gradient" padding="lg" className="test-class">
        <div>Content</div>
      </PageShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-gradient-to-br');
    expect(wrapper).toHaveClass('test-class');

    const contentContainer = wrapper.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('max-w-screen-xl');
    expect(contentContainer).toHaveClass('p-8');
  });

  it('renders with min-h-screen for full viewport height', () => {
    const { container } = render(
      <PageShell>
        <div>Content</div>
      </PageShell>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('centers content with mx-auto', () => {
    const { container } = render(
      <PageShell>
        <div>Content</div>
      </PageShell>,
    );

    const contentContainer = container.querySelector('.mx-auto') as HTMLElement;
    expect(contentContainer).toHaveClass('mx-auto');
  });
});
