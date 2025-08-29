export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
      <p className="text-muted-foreground text-lg mb-8 text-center">
        Last updated: {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      
      <div className="prose prose-lg max-w-none">
        <div className="bg-card p-6 rounded-lg border mb-8">
          <p className="text-muted-foreground leading-7">
            At OnTheHunt, we value your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            We collect information you provide to us, including your name, email, professional details, 
            and any information required to deliver our job search services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use your information to provide job search services, match you with opportunities, 
            improve our platform, and communicate with you about our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Information Sharing</h2>
          <p className="text-muted-foreground mb-4">
            We do not sell your personal information. We may share your information with employers 
            when you apply for jobs, or as required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate security measures to protect your personal information 
            from unauthorized access, alteration, or disclosure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Your Rights</h2>
          <p className="text-muted-foreground mb-4">
            You have the right to access, correct, or delete your personal information. 
            You can also opt out of marketing communications at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> privacy@onthehunt.com</p>
              <p><strong>Phone:</strong> +1 (234) 567-890</p>
              <p><strong>Address:</strong> 123 Career Street, Job City, Opportunity State, 12345</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
