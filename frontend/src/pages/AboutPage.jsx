import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center gradient-text">About VidyaPaalam</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            VidyaPaalam (skill-bridge) is a platform dedicated to connecting 
            passionate mentors with eager learners. Our name reflects our 
            mission: "Vidya" meaning knowledge or skill, and "Paalam" meaning 
            bridge - together forming a bridge of knowledge.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Our Vision</h2>
          <p className="mb-6">
            We envision a world where everyone has access to personalized learning 
            from experienced mentors, regardless of geographical boundaries. By 
            connecting skilled individuals with those eager to learn, we aim to 
            democratize knowledge sharing and empower communities through education.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Our Mission</h2>
          <p className="mb-6">
            Our mission is to create an inclusive and accessible platform that:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Bridges the gap between those who have skills and those who want to learn them</li>
            <li>Provides a user-friendly environment for mentors to share their expertise</li>
            <li>Offers learners personalized guidance from experienced practitioners</li>
            <li>Fosters a community of continuous learning and knowledge exchange</li>
            <li>Celebrates diverse skills ranging from technical to creative domains</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Why Choose VidyaPaalam?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">For Learners</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-skill font-bold">✓</span>
                  <span>Access to experienced mentors across various domains</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-skill font-bold">✓</span>
                  <span>Personalized learning paths tailored to your goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-skill font-bold">✓</span>
                  <span>Flexible scheduling to fit your availability</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">For Mentors</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-skill font-bold">✓</span>
                  <span>Platform to share your expertise and passion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-skill font-bold">✓</span>
                  <span>Connect with eager learners worldwide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-skill font-bold">✓</span>
                  <span>Build your teaching profile and reputation</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-accent p-8 rounded-lg text-center mt-12">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="mb-6">
              Whether you're looking to share your knowledge or acquire new skills,
              VidyaPaalam is the bridge that connects you to a world of learning possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <button size="lg">Join as a Learner</button>
              </Link>
              <Link to="/become-mentor">
                <button variant="outline" size="lg">Become a Mentor</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;