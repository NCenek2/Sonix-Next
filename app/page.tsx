import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sonix",
  description: "Sonix App",
};

export default function Home() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Unfiltered
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Speak Your Mind
              </p>
              <p className="my-6 text-lg leading-8 text-gray-600">
                Welcome to Sonix, the platform to discuss anything that is on
                your mind.
              </p>
            </div>
            <Link href="/api/auth/signin" className="">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
