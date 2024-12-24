export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg">OnTheHunt</h3>
          <p className="text-gray-600 mt-2">
            Your AI-powered career companion for finding and landing your dream job.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Features</h3>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>Job Search</li>
            <li>Resume Builder</li>
            <li>Career Chat</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Company</h3>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions">Terms and Conditions</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Connect</h3>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>Twitter</li>
            <li>LinkedIn</li>
            <li>GitHub</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
