import { Facebook, Instagram, Youtube } from "lucide-react";
import { Asterisk, SketchDivider } from "./sketch";

export function Footer() {
  return (
    <footer className="mt-20 pb-10">
      <div className="max-w-6xl mx-auto px-5">
        <SketchDivider />
        <div className="grid md:grid-cols-3 gap-8 py-10 items-center">
          <div className="space-y-3">
            <p className="font-hand text-sm">Make us a part of your lifestyle</p>
            <div className="flex gap-3">
              <a aria-label="Facebook" className="ink-btn !p-2"><Facebook size={18} strokeWidth={1.5} /></a>
              <a aria-label="Instagram" className="ink-btn !p-2"><Instagram size={18} strokeWidth={1.5} /></a>
              <a aria-label="YouTube" className="ink-btn !p-2"><Youtube size={18} strokeWidth={1.5} /></a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Asterisk size={28} />
            <span className="font-script text-3xl">jia mi</span>
          </div>
          <p className="font-serif italic text-sm text-right md:text-right">
            A taste of home in every story.
          </p>
        </div>
      </div>
    </footer>
  );
}
