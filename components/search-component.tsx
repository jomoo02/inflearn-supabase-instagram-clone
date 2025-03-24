'use client';

import { Input } from '@material-tailwind/react';

export default function SearchComponent({ setSearchInput }) {
  return (
    <Input
      onChange={(e) => setSearchInput(e.target.value)}
      label="Search Images"
      icon={<i className="fa-solid fa-magnifying-glass" />}
    />
  );
}
