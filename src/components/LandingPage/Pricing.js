export default function Pricing() {
    return (
        <section className="bg-[#001F54] text-white py-16 text-center">
            <h2 className="text-4xl font-bold mb-6">Pricing</h2>
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-lg shadow-lg inline-block max-w-md mx-auto">
                <p className="text-3xl font-bold mb-4">3 days of unlimited access</p>
                <p className="text-5xl font-bold mb-6">Try for free</p>
                <ul className="text-left mb-6 space-y-2">
                    <li className="flex items-center space-x-2">
                        <span>✔️</span> <span>Solve unlimited questions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span>✔️</span> <span>Universal Compatibility</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span>✔️</span> <span>Works on graph & image-based questions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span>✔️</span> <span>Step-by-step answer explanations</span>
                    </li>
                </ul>
                <p className="text-2xl font-semibold mb-4">250K+ satisfied users</p>
                <p className="text-2xl font-semibold mb-6">20M+ questions solved</p>
                <button className="bg-white text-blue-600 py-3 px-6 rounded-full font-semibold shadow hover:bg-gray-100 transition duration-300">
                    Get Started
                </button>
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <img src="/path-to-visa-logo.png" alt="Visa" className="h-6"/>
                    <img src="/path-to-mastercard-logo.png" alt="Mastercard" className="h-6"/>
                    <img src="/path-to-paypal-logo.png" alt="PayPal" className="h-6"/>
                    <img src="/path-to-apple-pay-logo.png" alt="Apple Pay" className="h-6"/>
                </div>
                <p className="text-sm mt-4">Cancel anytime | Renews at $9.99/month</p>
            </div>
        </section>
    );
}
