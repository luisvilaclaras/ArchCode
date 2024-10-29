import React from 'react';

export default function VideoWithExplanation() {
  return (
    <section className="bg-darkBlue text-white py-16">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Video */}
        <div className="space-y-6">
          <video className="w-full rounded-md shadow-lg" controls loop muted>
            <source src="https://path-to-your-video/video.mp4" type="video/mp4" />
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
  );
}
