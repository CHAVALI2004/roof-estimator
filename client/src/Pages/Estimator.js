import { useEffect, useState } from "react";
import QuestionField from "../components/QuestionField";
import ProgressBar from "../components/ProgressBar";
import {
  getConfig,
  submitEstimate,
} from "../api";

function Estimator() {
  const [config, setConfig] = useState(null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [estimate, setEstimate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  function updateAnswer(key, value) {
    setAnswers((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function updateContact(key, value) {
    setContact((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function nextStep() {
    const question = config.questions[step];

    if (
      question.required &&
      !answers[question.key]
    ) {
      setError("Please answer this question.");
      return;
    }

    setError("");
    setStep((previous) => previous + 1);
  }

  function previousStep() {
    setError("");
    setStep((previous) => previous - 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !contact.name ||
      !contact.phone ||
      !contact.email
    ) {
      setError("Please complete all contact details.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await submitEstimate({
        ...contact,
        answers,
      });

      setEstimate(result.estimate);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="center-message">
        Loading estimator...
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="center-message error">
        {error}
      </div>
    );
  }

  if (estimate) {
    return (
      <div className="page">
        <div className="estimator-card result-card">
          <div className="success-icon">✓</div>

          <p className="eyebrow">
            Your Estimate
          </p>

          <h1>
            Your Estimated Roof Cost
          </h1>

          <div className="estimate">
            ${estimate.low.toLocaleString()}{" "}
            <span>—</span>{" "}
            ${estimate.high.toLocaleString()}
          </div>

          <p className="result-description">
            Based on the information you provided,
            your estimated roofing cost is within
            this range.
          </p>

          <p className="contact-message">
            We'll contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  const totalQuestions = config.questions.length;

  const isContactStep =
    step === totalQuestions;

  return (
    <div className="page">
      <header className="header">
        <div className="logo">
          {config.business.name}
        </div>

        <div className="region">
          {config.business.region}
        </div>
      </header>

      <main className="estimator-card">
        {!isContactStep && (
          <ProgressBar
            current={step + 1}
            total={totalQuestions + 1}
          />
        )}

        {isContactStep ? (
          <form onSubmit={handleSubmit}>
            <p className="eyebrow">
              Almost done!
            </p>

            <h1>Get your estimate</h1>

            <p className="subtitle">
              Enter your contact details to see
              your estimated roof cost.
            </p>

            <div className="contact-fields">
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(event) =>
                    updateContact(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Your name"
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(event) =>
                    updateContact(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="Your phone number"
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(event) =>
                    updateContact(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            <div className="buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={previousStep}
              >
                Back
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Calculating..."
                  : "Get My Estimate"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="eyebrow">
              Roof Estimate
            </p>

            <h1>
              {config.questions[step].label}
            </h1>

            <p className="subtitle">
              Tell us a little more about your roof.
            </p>

            <QuestionField
              question={config.questions[step]}
              value={answers[
                config.questions[step].key
              ]}
              onChange={(value) =>
                updateAnswer(
                  config.questions[step].key,
                  value
                )
              }
            />

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            <div className="buttons">
              {step > 0 && (
                <button
                  className="secondary-button"
                  onClick={previousStep}
                >
                  Back
                </button>
              )}

              <button
                className="primary-button"
                onClick={nextStep}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Estimator;
