'use client';

import { searchFiles } from 'actions/storage-actions';
import DropboxImage from './dropbox-image';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@material-tailwind/react';

export default function DropboxImageList({ searchInput }) {
  const searchImageQuery = useQuery({
    queryKey: ['images', searchInput],
    queryFn: () => searchFiles(searchInput),
  });

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 xl:gap-6">
      {searchImageQuery.isLoading && <Spinner />}
      {searchImageQuery.data &&
        searchImageQuery.data.map((image) => (
          <DropboxImage key={image.id} image={image} />
        ))}
    </section>
  );
}
