'use client';

import { useState } from 'react';
import Header from '@/components/Header';

import Information from '@/components/Information';
import AddClient from '@/components/AddClient';
import Clients from '@/components/Clients';
import AddInvoice from '@/components/AddInvoice';

export default function HomePage() {
  const [view, setView] = useState('');

  function renderContent() {
    switch (view) {
      case 'information':
        return <Information />;
      case 'addClient':
        return <AddClient />;
      case 'clients':
        return <Clients />;
      case 'addInvoice':
        return <AddInvoice />;
      default:
        return <AddInvoice />;
    }
  }

  return (
    <>
      <Header onChangeView={setView} activeView={view} />
      <main className="overflow-auto min-h-screen bg-[#f4f6f8]">{renderContent()}</main>
    </>
  );
}
