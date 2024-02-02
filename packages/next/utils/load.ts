/**
 * Utility to load a component with an optional pre-determined delay.
 *
 * This was designed to improve anti spam with async form loading.
 *
 * @see https://github.com/vercel/next.js/blob/main/packages/next/next-server/lib/dynamic.tsx
 * @see https://github.com/vercel/next.js/blob/canary/examples/with-dynamic-import/pages/index.js
 */
export function load<T>(component: T, milliseconds: number) {
  return new Promise<typeof component>((resolve) => {
    setTimeout(() => resolve(component), milliseconds);
  });
}
