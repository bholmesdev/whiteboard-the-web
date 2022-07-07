import type { JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import DownArrow from './icons/DownArrow';

type Props = {
  video: JSX.Element;
}

export default function VideoViewer({ video }: Props) {
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen())}><DownArrow /></button>
      {isOpen() ? video : null}
    </>
  )
}