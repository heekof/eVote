import ReactNode from "react";

// type script annottation ...
interface Props {
  children: ReactNode;
}

const Alert = ({ children }) => {
  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
};

export default Alert;
