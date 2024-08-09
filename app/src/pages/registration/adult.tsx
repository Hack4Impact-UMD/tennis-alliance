import TennisBackground from "@/components/tennisBackground";
import classes from "@/styles/registration.module.css";

const Adult = () => {
  return (
    <div className={classes.container}>
      <TennisBackground
        title="Create an Adult Account"
        subtitle="Please fill out the following sections"
      />
      <form>
        <label id="name">Name</label>
        <div>
          <input
            id="first_name"
            aria-labelledby="name"
            type="text"
            placeholder="First Name"
            required
          />
          <input
            id="last_name"
            aria-labelledby="name"
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Email" required />
        <label htmlFor="phone">Phone Number</label>
        <input id="phone" type="text" placeholder="Phone Number" required />
        <label htmlFor="zip">Zip Code</label>
        <input id="zip" type="text" placeholder="Zip Code" required />
        <p>
          Click{" "}
          <a
            href="https://drive.google.com/file/d/1RHLryceRPbAGlSQdtRGeT70LWzyrozEa/view"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{" "}
          to access the waiver form
        </p>
        <label htmlFor="waiver">
          Check the box below to agree to the terms and conditions stated in the
          waiver
        </label>
        <input id="waiver" type="checkbox" required />
        <label htmlFor="notification">
          Check the box below to receive occasional notifications about upcoming
          events and tennis community news.
        </label>
        <input id="notification" type="checkbox" />
        <button className="button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Adult;
