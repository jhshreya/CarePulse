"use client"
import { convertFileToUrl } from '@/lib/utils';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

type FileUploaderProps = {
  files: File[],
  onChange: (files: File[]) => void
}

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {files && files?.length>0 ? (
        <Image src={convertFileToUrl(files[0])}
        width={100}
        height={100}
        alt="upload image"
        className="max-h-[400px] overflow-hidden object-cover"/>
      ):(<>
        <Image src="/assets/icons/upload.svg"
        width={40}
        height={40}
        alt="upload"/>
        <div className='file-upload_label'>
            <p className='text-14-regular'>
                <span className='text-green-500'>Click to Upload</span>
                <span>or drag and drop</span>
            </p>
            <p>
                SVG,JPG,PNG or GIF(max 800*400)
            </p>
        </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;

