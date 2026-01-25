import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: '3.5rem',
              lineHeight: '1.2'
            }}
            className="mb-6 tracking-tight"
          >
            About The Modern Blog
          </h1>
          <p 
            className="text-gray-600"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.25rem',
              lineHeight: '1.8'
            }}
          >
            A space dedicated to thoughtful writing, minimalist design, and meaningful conversations.
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative overflow-hidden aspect-[16/9] mb-16">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY0NzA5NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="About us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section>
            <h2 
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="mb-4 tracking-tight"
            >
              Our Mission
            </h2>
            <p 
              className="text-gray-800 mb-4"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.125rem',
                lineHeight: '1.9'
              }}
            >
              In a world of constant noise and distraction, we believe in the power of clarity. The Modern Blog was founded on the principle that great content deserves great presentation—clean, focused, and beautiful.
            </p>
            <p 
              className="text-gray-800"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.125rem',
                lineHeight: '1.9'
              }}
            >
              We cover topics ranging from design and technology to lifestyle and productivity, always with an emphasis on depth over breadth, quality over quantity.
            </p>
          </section>

          <section>
            <h2 
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="mb-4 tracking-tight"
            >
              Our Values
            </h2>
            <div className="space-y-6">
              <div>
                <h3 
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  className="mb-2 tracking-tight"
                >
                  Simplicity
                </h3>
                <p 
                  className="text-gray-800"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.125rem',
                    lineHeight: '1.9'
                  }}
                >
                  We strip away the unnecessary to focus on what truly matters. Every word, every design element serves a purpose.
                </p>
              </div>

              <div>
                <h3 
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  className="mb-2 tracking-tight"
                >
                  Authenticity
                </h3>
                <p 
                  className="text-gray-800"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.125rem',
                    lineHeight: '1.9'
                  }}
                >
                  We write about what we know and care about deeply. Our content comes from real experience and genuine insight.
                </p>
              </div>

              <div>
                <h3 
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  className="mb-2 tracking-tight"
                >
                  Excellence
                </h3>
                <p 
                  className="text-gray-800"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.125rem',
                    lineHeight: '1.9'
                  }}
                >
                  We believe in doing fewer things, but doing them exceptionally well. Quality is never negotiable.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-12">
            <h2 
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="mb-4 tracking-tight"
            >
              Join Our Community
            </h2>
            <p 
              className="text-gray-800 mb-6"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.125rem',
                lineHeight: '1.9'
              }}
            >
              Subscribe to our newsletter to receive new articles, design inspiration, and thoughtful insights delivered to your inbox every week.
            </p>
            <button
              className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: 'var(--accent-blog)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Subscribe Now
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
