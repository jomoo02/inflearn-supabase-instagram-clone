'use client';

import { Spinner } from '@material-tailwind/react';
import { useCallback } from 'react';
import { uploadFile } from 'actions/storage-actions';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'config/react-query-client-provider';
import { useDropzone } from 'react-dropzone';

export default function FileDragDropZone() {
  const uploadImageMutaion = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();

      acceptedFiles.forEach((file) => {
        formData.append(file.name, file);
      });

      await uploadImageMutaion.mutate(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploadImageMutaion.isPending ? (
        <Spinner />
      ) : isDragActive ? (
        <p>파일을 여기에 놓으세요.</p>
      ) : (
        <p>파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
      )}
    </div>
  );
}
