'use client';

import Image from 'next/image';
import { IconButton, Spinner } from '@material-tailwind/react';
import { getImageUrl } from 'utils/supabase/storage';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'config/react-query-client-provider';
import { deleteFile } from 'actions/storage-actions';
import { formatDate } from 'utils/foramt-data';

export default function DropboxImage({ image }) {
  console.log(image);
  const deleteFileMutaiton = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['images'],
      });
    },
  });

  return (
    <div className="relative w-full flex flex-col gap-2 p-4 border border-gray-100 rounded-2xl shadow-md">
      <div className="!w-full !h-auto rounded-2xl bg-blue-gray-50 flex justify-center">
        <div className="w-20 h-40 flex items-center justify-center relative">
          <Image
            src={getImageUrl(image.name)}
            alt="Dropbox Logo"
            width={80}
            height={60}
            style={{ width: 80, height: 60 }}
          />
        </div>
      </div>
      <div className="grid gap-y-1">
        <div className="text-blue-gray-800 font-medium">{image.name}</div>
        <div className="text-xs text-blue-gray-300">
          updated: {formatDate(image.updated_at)}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <IconButton
          onClick={() => {
            deleteFileMutaiton.mutate(image.name);
          }}
          color="red"
        >
          {deleteFileMutaiton.isPending ? (
            <Spinner />
          ) : (
            <i className="fas fa-trash" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
