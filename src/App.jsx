import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotFound } from './components/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <NotFound />
    </AuthProvider>
  );
}
