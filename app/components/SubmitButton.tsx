"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({
  name,
  pendingName,
}: {
  name: string;
  pendingName: string;
}) => {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-grow text-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
    >
      {pending ? pendingName : name}
    </button>
  );
};

export default SubmitButton;
