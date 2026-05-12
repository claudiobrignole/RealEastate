"use client";

export default function EditorialBlock({ data }: { data: any }) {
  if (!data?.body && !data?.title) return null;

  return (
    <section className="px-margin py-lg max-w-4xl mx-auto">
      {data?.title && (
        <h2 className="font-h2 text-h2 text-primary mb-md tracking-tight">
          {data.title}
        </h2>
      )}
      {data?.layout === 'with-accent' && (
        <div className="w-12 h-[2px] bg-secondary mb-md" />
      )}
      {data?.body && (
        <div
          className="font-body-lg text-body-lg text-on-surface leading-relaxed 
                     prose-headings:font-h3 prose-headings:text-primary
                     [&_h2]:font-h3 [&_h2]:text-h3 [&_h2]:text-primary [&_h2]:mb-sm [&_h2]:mt-lg
                     [&_strong]:font-semibold [&_strong]:text-primary
                     [&_p]:mb-md [&_p]:text-hyphenated"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      )}
    </section>
  );
}
