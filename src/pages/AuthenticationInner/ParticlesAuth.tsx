import withRouter from "../../Components/Base/withRouter";

const ParticlesAuth = ({ children }: any) => {
  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div className="bg-overlay"></div>

        <div className="shape">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1440 120"
          >
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>

        {/* pass the children */}
        {children}
      </div>
      <div>
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    &copy; {new Date().getFullYear()} Shivinfotech. Crafted with{" "}
                    by Shivinfotech
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default withRouter(ParticlesAuth);
