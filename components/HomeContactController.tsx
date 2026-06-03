"use client";

import { useState } from "react";
import ContactModal from "./ContactModal";

export default function HomeContactController() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setContactOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden h-11 items-center rounded-md bg-[#0052d9] px-5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(0,82,217,0.22)] transition-colors hover:bg-[#276fe8] md:inline-flex"
      >
        联系我们
      </button>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
