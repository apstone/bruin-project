'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FC } from 'react';

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="mx-auto w-full bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
      {pathname !== '/' && (
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back
        </button>
      )}
      <h1 className="text-lg font-bold text-gray-800">
        My App
      </h1>
    </header>
  );
};

export default Header;

