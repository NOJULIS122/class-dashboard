type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="mb-3 h-1.5 w-14 rounded-full bg-[#fbbc34]" />
      <h1 className="text-3xl font-extrabold tracking-tight text-[#19407a] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-[#849aaa]">{description}</p>
    </header>
  );
}
