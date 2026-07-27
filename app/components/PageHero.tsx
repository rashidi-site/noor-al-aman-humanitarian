type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
};

export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <img src={image} alt={imageAlt} />
      <div className="page-hero__shade" aria-hidden="true" />
      <div className="shell page-hero__content">
        <p className="eyebrow eyebrow--gold">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
