import type { SVGProps } from 'react';

export function AgafarmaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Agafarma Logo"
      {...props}
    >
      <g fill="currentColor">
        <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 82C29.6 87 13 70.4 13 50S29.6 13 50 13s37 16.6 37 37-16.6 37-37 37z" />
        <path d="M50 25c-8.3 0-15 6.7-15 15v30h10V40c0-2.8 2.2-5 5-5s5 2.2 5 5v30h10V40c0-8.3-6.7-15-15-15z" />
      </g>
    </svg>
  );
}
