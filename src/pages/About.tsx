import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">About Cricket Auction</h1>
          <p className="mt-3 text-muted-foreground">
            Revolutionizing Cricket player auctions for teams and players.
          </p>

          <section className="mt-8 text-left">
            <h2 className="text-xl font-semibold">Our Mission</h2>
            <p className="mt-3 text-muted-foreground">
              Organizing a tournament can be challenging — from handling entry
              forms to creating draws and scheduling matches. <strong>Cricket
              Auction</strong> streamlines the entire workflow with an easy-to-use
              platform built specifically for player auctions and tournament
              management.
            </p>
            <p className="mt-3 text-muted-foreground">
              The platform supports real-time auctions, a voting system to
              engage fans, and tools to help organizers run seamless,
              professional tournaments on any device.
            </p>
          </section>

          <section className="mt-8 text-left">
            <h2 className="text-xl font-semibold">Get Involved</h2>
            <p className="mt-3 text-muted-foreground">
              Whether you are an organizer, player, or fan, we welcome you to
              explore tournaments, participate in auctions, and help shape the
              future of local cricket competitions.
            </p>
            <div className="mt-4">
              <Link to="/tournaments" className="text-primary underline">
                Browse tournaments
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
