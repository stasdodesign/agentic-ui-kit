import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Agentic UX: 12 States Design System',
  description: 'Enterprise React component library and interactive playground implementing the 12 states of autonomous AI agents with transparent Tool Calling, Reasoning Chains, and Human-in-the-Loop approval.',
  openGraph: {
    title: 'Agentic UX: 12 States Design System',
    description: 'Enterprise React component library and interactive playground implementing the 12 states of autonomous AI agents with transparent Tool Calling, Reasoning Chains, and Human-in-the-Loop approval.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentic UX: 12 States Design System',
    description: 'Enterprise React component library and interactive playground implementing the 12 states of autonomous AI agents with transparent Tool Calling, Reasoning Chains, and Human-in-the-Loop approval.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
