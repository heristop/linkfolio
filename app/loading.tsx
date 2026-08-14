export default function Loading() {
  return (
    // `output` rather than a bare `div`: `aria-label` is prohibited on a
    // role-less element, so on a `div` the name is dropped and the placeholder
    // announces as nothing at all.
    <output
      aria-busy="true"
      aria-label="Loading page"
      className="flex flex-col items-center gap-6 max-w-(--breakpoint-lg) lg:mx-auto sm:m-4 m-2 py-16 animate-pulse"
    >
      <div className="w-28 h-28 rounded-full bg-current opacity-10" />
      <div className="w-56 h-7 rounded-sm bg-current opacity-10" />
      <div className="w-24 h-4 rounded-sm bg-current opacity-10" />
    </output>
  );
}
