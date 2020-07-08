// pathnameTesters.ts - a set of testers for contextual display system

export type PathNameTester = (pathname: string) => boolean;

export const isTasks: PathNameTester = (pathname) => pathname === '/tasks';
export const isTask: PathNameTester = (pathname) => pathname.startsWith('/task/view');
