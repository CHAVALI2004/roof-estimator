function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-wrapper">
      <div className="progress-text">
        Step {current} of {total}
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;