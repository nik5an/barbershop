const SignInForm = () => {
  return (
    <div>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Email</span>
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          className="input input-bordered w-full max-w-xs"
        />
        <div className="label"></div>
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          className="input input-bordered w-full max-w-xs"
        />
        <div className="label"></div>
      </label>
      <button
        className="btn bg-black text-white w-full text-xl font-medium"
        type="submit"
      >
        Влез
      </button>
    </div>
  );
};

export default SignInForm;
