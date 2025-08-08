'use client';

import { useState } from 'react';
import {
  HiInformationCircle,
  HiUserAdd,
  HiUsers,
  HiDocumentAdd,
  HiMenu,
  HiX,
} from 'react-icons/hi';

export default function Header({ onChangeView, activeView }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bgColor = 'bg-[#212b36]';
  const textColor = 'text-[#6fcf97]';
  const activeBg = 'bg-[#27ae60]';
  const hoverBg = 'hover:bg-[#1f7a34]';

  const buttons = [
    { key: 'information', label: 'Information', icon: <HiInformationCircle size={20} /> },
    { key: 'addClient', label: 'Ajouter Client', icon: <HiUserAdd size={20} /> },
    { key: 'clients', label: 'Clients', icon: <HiUsers size={20} /> },
    { key: 'addInvoice', label: 'Ajouter Facture', icon: <HiDocumentAdd size={20} /> },
  ];

  function handleClick(key) {
    onChangeView(key);
    setDrawerOpen(false);
  }

  return (
    <>
      {/* Desktop Sidebar gauche */}
      <nav
        className={`
          hidden md:flex flex-col fixed top-0 left-0 h-full w-64
          ${bgColor} ${textColor} font-mono shadow-lg border-r border-[#637381]
        `}
      >
        <div
          className="flex items-center justify-center h-16 border-b border-[#637381] cursor-pointer select-none text-3xl font-bold hover:text-[#27ae60] transition-colors"
          onClick={() => handleClick('information')}
        >
          Déla
        </div>
        <div className="flex flex-col flex-grow p-4 space-y-3 overflow-y-auto">
          {buttons.map(({ key, label, icon }) => {
            const isActive = activeView === key;
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  cursor-pointer
                  flex items-center space-x-3 px-3 py-2 rounded-md
                  transition-colors focus:outline-none focus:ring-2 focus:ring-[#27ae60]
                  ${isActive ? `${activeBg} text-white` : `hover:${hoverBg} hover:text-white`}
                `}
              >
                {icon}
                <span className="text-lg">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav
        className={`
          md:hidden fixed top-0 left-0 right-0 flex items-center justify-between
          h-14 px-4
          ${bgColor} ${textColor} font-mono shadow-md border-b border-[#637381]
          z-50
        `}
      >
        <div
          className="text-2xl font-bold cursor-pointer select-none hover:text-[#27ae60]"
          onClick={() => handleClick('information')}
        >
          Déla
        </div>

        {/* Bouton toggle drawer */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label={drawerOpen ? 'Fermer menu' : 'Ouvrir menu'}
          className="cursor-pointer p-2 rounded hover:bg-[#1f7a34] focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
        >
          {drawerOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      {/* Drawer mobile à gauche, hauteur = 100vh - 56px (taille topbar) */}
      <div
        className={`
          fixed top-14 left-0 w-64
          ${bgColor} ${textColor} font-mono shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
          flex flex-col
          h-[calc(100vh-56px)]
          border-r border-[#637381]
        `}
        aria-hidden={!drawerOpen}
      >
        <div className="flex flex-col p-4 space-y-3 overflow-y-auto flex-grow">
          {buttons.map(({ key, label, icon }) => {
            const isActive = activeView === key;
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  cursor-pointer
                  flex items-center space-x-3 px-3 py-2 rounded-md
                  transition-colors focus:outline-none focus:ring-2 focus:ring-[#27ae60]
                  ${isActive ? `${activeBg} text-white` : `hover:${hoverBg} hover:text-white`}
                `}
              >
                {icon}
                <span className="text-lg">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlay sombre derrière drawer mobile */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
