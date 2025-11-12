import type { SVGProps } from 'react';

export function AgafarmaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Agafarma Logo"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="8">
        {/* Outer Circle - now just an outline */}
        <circle cx="50" cy="50" r="45" fill="none" />
        
        {/* Heart Shape - now just an outline */}
        <path 
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          d="M50 40C40 25 25 30 25 45C25 60 50 75 50 75C50 75 75 60 75 45C75 30 60 25 50 40Z"
        />
      </g>
    </svg>
  );
}
