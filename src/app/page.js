import Menu from '@/components/LandingPage/Menu';
import TryForFree from '@/components/LandingPage/TryForFree';
import ScrollingImages from '@/components/LandingPage/ScrollingImages';
import Reviews from '@/components/LandingPage/Reviews';
import Pricing from '@/components/LandingPage/Pricing';
import FAQ from '@/components/LandingPage/FAQ';


export default function Home() {
  return (
    <div>
      {/* Menu Component */}
      <Menu />

      <section className="hero bg-darkBlue text-white h-screen flex items-center justify-center pt-24"> 
  <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto px-10 items-center">
    <div className="text-left">
      <h1 className="text-5xl font-bold mb-4 leading-snug">Instant, Expert Homework Help</h1>
      <p className="text-xl mb-6">Reach academic excellence with our AI homework solver</p>
      <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
        Try For Free
      </button>
      <div className="mt-8 flex space-x-8 text-lg text-gray-300">
        <div>
          <strong className="text-white text-2xl">250K+</strong>
          <p className="text-gray-400 text-sm">active users</p>
        </div>
        <div>
          <strong className="text-white text-2xl">20M+</strong>
          <p className="text-gray-400 text-sm">questions solved</p>
        </div>
      </div>
    </div>
    <div className="flex justify-center">
      <video 
        src="https://www.w3schools.com/html/mov_bbb.mp4" 
        className="w-full max-w-lg rounded-lg shadow-lg"
        autoPlay 
        loop 
        muted
        playsInline
      />
    </div>
  </div>
</section>






      {/* Scrolling Images Section */}
      <ScrollingImages />

      {/* Video with explanation Section */}
      <section className="bg-darkBlue text-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          {/* Video */}
          <div className="space-y-6">
            <video className="w-full rounded-md shadow-lg" autoPlay loop muted>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Explicación del video */}
          <div>
            <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">✔ Universal Compatibility</span>
            <h2 className="text-3xl font-bold mb-4">Get instant answers</h2>
            <p className="mb-4">
              With just a click of a button, our homework solver will provide you with the answers to any question.
              It can guide you through complex problems on any website, even those without specialized support.
            </p>
            <p>
              Additionally, it is fully integrated with Learning Management Systems (LMS) such as Blackboard, D2L, Classmarker,
              Khan Academy, Schoology, Canvas, Moodle, and many others.
            </p>
          </div>
        </div>
      </section>

      {/* Segunda Sección: Video a la derecha, Texto a la izquierda */}
      <section className="bg-darkBlue text-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          
          {/* Explicación del video */}
          <div>
            <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">✔ Advanced Recognition</span>
            <h2 className="text-3xl font-bold mb-4">Include graphs and image-based questions</h2>
            <p className="mb-4">
              With a simple screenshot, you can capture any visual challenge — be it a detailed graph or a complex image.
            </p>
            <p>
              Our advanced AI automatically detects the type of visual content, analyzing it to provide you with the most accurate answer.
            </p>
          </div>

          {/* Video */}
          <div className="space-y-6">
            <video className="w-full rounded-md shadow-lg" autoPlay loop muted>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

        </div>
      </section>

            {/* Video with explanation Section */}
            <section className="bg-darkBlue text-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          {/* Video */}
          <div className="space-y-6">
            <video className="w-full rounded-md shadow-lg" autoPlay loop muted>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Explicación del video */}
          <div>
            <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">✔ Universal Compatibility</span>
            <h2 className="text-3xl font-bold mb-4">Get instant answers</h2>
            <p className="mb-4">
              With just a click of a button, our homework solver will provide you with the answers to any question.
              It can guide you through complex problems on any website, even those without specialized support.
            </p>
            <p>
              Additionally, it is fully integrated with Learning Management Systems (LMS) such as Blackboard, D2L, Classmarker,
              Khan Academy, Schoology, Canvas, Moodle, and many others.
            </p>
          </div>
        </div>
      </section>


      {/* Information Section */}
      <section className="bg-darkBlue py-20 text-center">
  <h2 className="text-4xl font-bold mb-6 text-white">The most advanced tool ever</h2>
  <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">Auto Select, Real-time Feedback, Language Support, and much more.</p>
  <div className="flex justify-center space-x-6">
    <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
      <div className="text-white text-5xl mb-4 mx-auto">
        {/* Reemplaza esto con el ícono de Auto-Select */}
        <i className="fas fa-check-circle"></i>
      </div>
      <h3 className="text-lg font-semibold text-white">Auto-Select</h3>
      <p className="text-gray-300 mt-2">Selects the correct answer in your LMS automatically</p>
    </div>
    <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
      <div className="text-white text-5xl mb-4 mx-auto">
        {/* Reemplaza esto con el ícono de Does Not Track */}
        <i className="fas fa-eye-slash"></i>
      </div>
      <h3 className="text-lg font-semibold text-white">Does Not Track</h3>
      <p className="text-gray-300 mt-2">Prevents websites from detecting our AI quiz solver</p>
    </div>
    <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
      <div className="text-white text-5xl mb-4 mx-auto">
        {/* Reemplaza esto con el ícono de Camouflage Mode */}
        <i className="fas fa-user-secret"></i>
      </div>
      <h3 className="text-lg font-semibold text-white">Camouflage Mode</h3>
      <p className="text-gray-300 mt-2">Invisible, discreet exam chrome extension</p>
    </div>
  </div>
  <div className="flex justify-center space-x-6 mt-8">
    <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
      <div className="text-white text-5xl mb-4 mx-auto">
        {/* Reemplaza esto con el ícono de Languages */}
        <i className="fas fa-language"></i>
      </div>
      <h3 className="text-lg font-semibold text-white">15+ Languages</h3>
      <p className="text-gray-300 mt-2">Supported</p>
    </div>
    <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
      <div className="text-white text-5xl mb-4 mx-auto">
        {/* Reemplaza esto con el ícono de User Privacy */}
        <i className="fas fa-lock"></i>
      </div>
      <h3 className="text-lg font-semibold text-white">User Privacy</h3>
      <p className="text-gray-300 mt-2">100% encrypted</p>
    </div>
  </div>
</section>




      {/* Try For Free Section */}
      <TryForFree />

      {/* Reviews Section */}
      <Reviews />

      {/* Satisfied Users Section */}
      <section className="bg-darkBlue text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">250K+ Satisfied Customers</h2>
        <p className="text-xl">Join 250,000+ students and get instant, expert help with your assignments.</p>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* 3 Simple Steps Section */}
      <section className="bg-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">3 Simple Steps to Get Started</h2>
        <video src="https://your-video-url.com" controls className="w-full max-w-lg mx-auto mb-8 shadow-lg rounded-lg"></video>
        <div className="flex justify-center space-x-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Step 1</h3>
            <p>Sign up for an account.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Step 2</h3>
            <p>Choose your subscription plan.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Step 3</h3>
            <p>Start getting instant homework help!</p>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <FAQ />

      {/* Footer Section */}
{/* Footer Section */}
<section className="bg-gradient-to-r from-lightBlue to-darkBlue text-white py-20 text-center">
  <h2 className="text-3xl font-bold mb-6">Start Boosting Your GPA Now</h2>
  <button className="bg-white text-blue-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
    Try For Free
  </button>
</section>


    </div>
  );
}
