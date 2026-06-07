import Container from "../components/layout/Container";
import { Mail, X, Globe } from "lucide-react";

const TEAM = [
  {
    name: "Cate Hall",
    role: "Founder & Editor-in-Chief",
    bio: "All models are wrong, but some are useful. Cate writes about mental models, decision-making, and the philosophy of knowing what you don't know.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "James Morrow",
    role: "Managing Editor",
    bio: "A former newspaper editor with 15 years in print journalism. James ensures every essay is sharp, clear, and worthy of the newsprint tradition.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Sarah Chen",
    role: "Design & UX Lead",
    bio: "Typography obsessive and grid enthusiast. Sarah brings the newsprint aesthetic to life with a relentless commitment to zero-radius corners and perfect hierarchy.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

export default function About() {
  return (
    <>
      {/* Masthead Hero */}
      <section className="border-b-4 border-ink">
        <Container className="py-16 md:py-20">
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
            About the Publication
          </div>
          <div className="w-16 h-1 bg-accent mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-8 lg:border-r border-ink pr-0 lg:pr-12">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.92] mb-6">
                <span className="float-left text-8xl sm:text-9xl leading-none mr-2 text-accent font-serif">
                  W
                </span>
                e believe in the power
                <br />
                of clear thinking<span className="text-accent">.</span>
              </h1>
              <p className="font-body text-base text-neutral-600 leading-relaxed text-justify max-w-2xl mb-6">
                The SMA Blog is a digital publication dedicated to exploring the mental models, 
                reasoning frameworks, and philosophical ideas that shape how we think about the 
                world. We publish long-form essays that challenge conventional wisdom, surface 
                hidden assumptions, and arm our readers with better cognitive tools.
              </p>
              <p className="font-body text-base text-neutral-600 leading-relaxed text-justify max-w-2xl">
                Named after the principle that &ldquo;all models are wrong, but some are useful,&rdquo; 
                we embrace the messiness of imperfect knowledge and the joy of being wrong. Our 
                writing spans philosophy, psychology, decision theory, and the art of thinking 
                itself — always with an eye toward what's practically useful.
              </p>
            </div>

            <div className="lg:col-span-4 pl-0 lg:pl-12 pt-8 lg:pt-0">
              <div className="border-2 border-ink p-6 bg-neutral-100">
                <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-4">
                  Publication Details
                </h3>
                <dl className="space-y-4">
                  {[
                    { label: "Founded", value: "2022" },
                    { label: "Frequency", value: "Weekly essays" },
                    { label: "Readership", value: "31,000+ subscribers" },
                    { label: "Format", value: "Long-form journalism" },
                    { label: "Philosophy", value: "Evidence-based, intellectually humble" },
                  ].map(({ label, value }) => (
                    <div key={label} className="border-b border-ink pb-3 last:border-b-0 last:pb-0">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                        {label}
                      </dt>
                      <dd className="font-serif text-base font-semibold mt-0.5">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Ornamental Divider */}
      <Container>
        <div className="py-12 text-center font-serif text-2xl text-neutral-400 tracking-[1em] select-none">
          &#x2727; &#x2727; &#x2727;
        </div>
      </Container>

      {/* The Masthead */}
      <section className="newsprint-texture">
        <Container>
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
            The Masthead
          </div>
          <div className="w-16 h-1 bg-accent mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className={`border-r border-ink ${
                  i === TEAM.length - 1 ? "border-r-0" : ""
                } ${i > 0 ? "border-t md:border-t-0" : ""}`}
              >
                <div className="p-6 md:p-8 hard-shadow-hover bg-bg">
                  <div className="mb-5 overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full aspect-square object-cover grayscale hover:sepia-[50%] transition-all duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-1">
                    {member.name}
                  </h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold mb-3">
                    {member.role}
                  </div>
                  <p className="font-body text-sm text-neutral-600 leading-relaxed text-justify">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Ornamental Divider */}
      <Container>
        <div className="py-12 text-center font-serif text-2xl text-neutral-400 tracking-[1em] select-none">
          &#x2727; &#x2727; &#x2727;
        </div>
      </Container>

      {/* By the Numbers */}
      <section>
        <Container>
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
            By the Numbers
          </div>
          <div className="w-16 h-1 bg-accent mb-10" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t-2 border-l-2 border-ink">
            {[
              { value: "31K", label: "Subscribers" },
              { value: "128", label: "Essays" },
              { value: "4yr", label: "Running" },
              { value: "12K", label: "Newsletter Opens" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="border-r-2 border-b-2 border-ink p-6 md:p-8 text-center"
              >
                <div className="font-mono text-3xl md:text-4xl font-bold text-ink mb-1">
                  {stat.value}
                </div>
                <div className="font-sans text-[10px] uppercase tracking-widest text-neutral-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Ornamental Divider */}
      <Container>
        <div className="py-12 text-center font-serif text-2xl text-neutral-400 tracking-[1em] select-none">
          &#x2727; &#x2727; &#x2727;
        </div>
      </Container>

      {/* Get in Touch */}
      <section className="border-t-4 border-ink bg-ink text-bg">
        <Container className="py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">
              Get in Touch
            </div>
            <div className="w-16 h-1 bg-accent mx-auto mb-8" />
            <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tighter mb-6">
              We&rsquo;d love to hear from you<span className="text-accent">.</span>
            </h2>
            <p className="font-body text-base text-neutral-400 leading-relaxed mb-10 max-w-lg mx-auto">
              Have a pitch, a question, or a model we should know about? 
              The best ideas come from readers who think differently.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Mail, label: "Email", href: "#" },
                { icon: X, label: "Twitter", href: "#" },
                { icon: Globe, label: "RSS Feed", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 border border-bg px-6 py-3 font-sans text-xs uppercase tracking-widest font-semibold text-bg hover:bg-bg hover:text-ink transition-all duration-200"
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
