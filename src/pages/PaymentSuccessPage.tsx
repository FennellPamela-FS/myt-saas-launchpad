import { CheckCircle2, Sparkles } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="pt-24 pb-16 bg-[#F3F3F3] min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-6">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold mb-3">
            You're in! Welcome to the cohort.
          </h1>

          <p className="text-[#464E54] mb-2">
            Your payment was successful and your site is being built right now.
          </p>

          <p className="text-sm text-[#818284] mb-8">
            You'll receive an email with your site link and admin access shortly.
            This usually takes just a few minutes.
          </p>

          <div className="flex items-center justify-center gap-2 p-4 bg-[#4EBCED]/10 rounded-lg text-[#2f718e] text-sm mb-8">
            <Sparkles size={16} />
            <span>Our AI is generating your personalized website copy now.</span>
          </div>

          <a
            href="/launchpad"
            className="btn btn-primary w-full inline-block"
          >
            Back to Launchpad
          </a>
        </div>
      </div>
    </div>
  );
}
