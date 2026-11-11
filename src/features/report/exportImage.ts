import { toBlob } from 'html-to-image';

const POLISH_CHARS: Record<string, string> = { ł: 'l', Ł: 'L' };

export const toFileName = (...parts: string[]) =>
  parts
    .join('-')
    .replace(/[łŁ]/g, (char) => POLISH_CHARS[char])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const renderPng = async (node: HTMLElement, fileName: string) => {
  const blob = await toBlob(node, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  });

  if (!blob) {
    throw new Error('Nie udało się wygenerować obrazka.');
  }

  return new File([blob], `${fileName}.png`, { type: 'image/png' });
};

export const canShareFiles = () => {
  if (typeof navigator === 'undefined' || !navigator.canShare) {
    return false;
  }

  const probe = new File([], 'probe.png', { type: 'image/png' });
  return navigator.canShare({ files: [probe] });
};

export const shareFile = async (file: File, title: string) => {
  try {
    await navigator.share({ files: [file], title });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return;
    }
    throw error;
  }
};

export const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
};
