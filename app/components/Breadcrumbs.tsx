'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Hem', href: '/' }
    ];

    if (pathSegments.length === 0) {
      return breadcrumbs;
    }

    if (pathSegments[0] === 'place' && pathSegments[1]) {
      breadcrumbs.push({
        name: 'Kebabställen',
        href: '/'
      });
      breadcrumbs.push({
        name: 'Kebabställe',
        href: pathname
      });
    } else if (pathSegments[0] === 'auth') {
      breadcrumbs.push({
        name: 'Logga in',
        href: '/auth'
      });
    } else if (pathSegments[0] === 'my-account') {
      breadcrumbs.push({
        name: 'Mitt konto',
        href: '/my-account'
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="breadcrumb-item">
            {index === breadcrumbs.length - 1 ? (
              <span className="breadcrumb-current" aria-current="page">
                {breadcrumb.name}
              </span>
            ) : (
              <>
                <Link href={breadcrumb.href} className="breadcrumb-link">
                  {breadcrumb.name}
                </Link>
                <span className="breadcrumb-separator" aria-hidden="true">
                  ›
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
