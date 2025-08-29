export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
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
            Welcome to OnTheHunt! These Terms and Conditions govern your use of our job search platform 
            and related services. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using the OnTheHunt platform, you accept and agree to be bound by these terms. 
            If you do not agree, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
          <p className="text-muted-foreground mb-4">
            OnTheHunt is a job search platform that provides job matching, resume building, 
            career guidance, and application tracking services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
          <p className="text-muted-foreground mb-4">
            You must be at least 18 years old to create an account. You are responsible for maintaining 
            the security of your account and providing accurate information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Acceptable Use</h2>
          <p className="text-muted-foreground mb-4">
            You agree not to use the platform for any illegal or harmful purposes, including harassment, 
            fraud, or unauthorized access to our systems.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">5. User Content</h2>
          <p className="text-muted-foreground mb-4">
            You retain ownership of content you submit. By submitting content, you grant us a license 
            to use it for providing our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Your privacy is important to us. Our collection and use of personal information 
            is governed by our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Job Applications</h2>
          <p className="text-muted-foreground mb-4">
            We facilitate job searches and applications but are not responsible for employment decisions, 
            job offers, or employment relationships.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            OnTheHunt shall not be liable for any indirect, incidental, or consequential damages 
            arising from your use of our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We may modify these terms at any time. Changes will be effective immediately upon posting. 
            Your continued use constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about these Terms and Conditions, please contact us:
          </p>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> legal@onthehunt.com</p>
              <p><strong>Phone:</strong> +1 (234) 567-890</p>
              <p><strong>Address:</strong> 123 Career Street, Job City, Opportunity State, 12345</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
