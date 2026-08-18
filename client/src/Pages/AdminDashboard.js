import { useEffect, useState } from "react";

function AdminDashboard({ onLogout }) {
  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    async function loadData() {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [configResponse, leadsResponse] =
          await Promise.all([
            fetch(
              "https://roof-estimator-backend-wl3z.onrender.com/api/admin/config",
              { headers }
            ),
            fetch(
              "https://roof-estimator-backend-wl3z.onrender.com/api/admin/leads",
              { headers }
            ),
          ]);

        const configData =
          await configResponse.json();

        const leadsData =
          await leadsResponse.json();

        if (!configResponse.ok) {
          throw new Error(
            configData.message ||
              "Failed to load configuration"
          );
        }

        setConfig(configData);
        setLeads(leadsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  function updateBusiness(field, value) {
    setConfig((previous) => ({
      ...previous,
      business: {
        ...previous.business,
        [field]: value,
      },
    }));
  }

  function updateModifier(field, value) {
    setConfig((previous) => ({
      ...previous,
      modifiers: {
        ...previous.modifiers,
        [field]: Number(value),
      },
    }));
  }

  function updateQuestion(
    questionIndex,
    field,
    value
  ) {
    setConfig((previous) => {
      const questions = [...previous.questions];

      questions[questionIndex] = {
        ...questions[questionIndex],
        [field]: value,
      };

      return {
        ...previous,
        questions,
      };
    });
  }

  function updateOption(
    questionIndex,
    optionIndex,
    field,
    value
  ) {
    setConfig((previous) => {
      const questions = [...previous.questions];

      const options = [
        ...questions[questionIndex].options,
      ];

      options[optionIndex] = {
        ...options[optionIndex],
        [field]: value,
      };

      questions[questionIndex] = {
        ...questions[questionIndex],
        options,
      };

      return {
        ...previous,
        questions,
      };
    });
  }

  async function saveConfiguration() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "https://roof-estimator-backend-wl3z.onrender.com/api/admin/config",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(config),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save configuration"
        );
      }

      setConfig(data.config);

      setMessage(
        "Configuration saved successfully."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("adminToken");
    onLogout();
  }

  if (loading) {
    return (
      <div className="center-message">
        Loading admin dashboard...
      </div>
    );
  }

  if (!config) {
    return (
      <div className="center-message">
        <p>{error || "Configuration not found."}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}

      <header className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Manage your roofing estimator
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>


      <main className="admin-content">

        {/* MESSAGES */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {/* BUSINESS */}

        <section className="admin-section">

          <div className="section-header">
            <div>
              <h2>Business Information</h2>

              <p>
                Update the information shown to
                customers.
              </p>
            </div>
          </div>

          <div className="admin-grid">

            <div className="field">
              <label>Business Name</label>

              <input
                value={config.business?.name || ""}
                onChange={(event) =>
                  updateBusiness(
                    "name",
                    event.target.value
                  )
                }
              />
            </div>


            <div className="field">
              <label>Region</label>

              <input
                value={
                  config.business?.region || ""
                }
                onChange={(event) =>
                  updateBusiness(
                    "region",
                    event.target.value
                  )
                }
              />
            </div>


            <div className="field">
              <label>Currency</label>

              <input
                value={
                  config.business?.currency || ""
                }
                onChange={(event) =>
                  updateBusiness(
                    "currency",
                    event.target.value
                  )
                }
              />
            </div>

          </div>

        </section>


        {/* PRICING */}

        <section className="admin-section">

          <div className="section-header">
            <div>
              <h2>Pricing Modifiers</h2>

              <p>
                These values are used by the
                server-side calculator.
              </p>
            </div>
          </div>


          <div className="admin-grid">

            <div className="field">
              <label>
                Waste Factor
              </label>

              <input
                type="number"
                step="0.01"
                value={
                  config.modifiers
                    ?.waste_factor ?? ""
                }
                onChange={(event) =>
                  updateModifier(
                    "waste_factor",
                    event.target.value
                  )
                }
              />
            </div>


            <div className="field">
              <label>
                Permit Flat Fee
              </label>

              <input
                type="number"
                value={
                  config.modifiers
                    ?.permit_flat_fee ?? ""
                }
                onChange={(event) =>
                  updateModifier(
                    "permit_flat_fee",
                    event.target.value
                  )
                }
              />
            </div>


            <div className="field">
              <label>
                Range Spread %
              </label>

              <input
                type="number"
                value={
                  config.modifiers
                    ?.range_spread_pct ?? ""
                }
                onChange={(event) =>
                  updateModifier(
                    "range_spread_pct",
                    event.target.value
                  )
                }
              />
            </div>

          </div>

        </section>


        {/* QUESTIONS */}

        <section className="admin-section">

          <div className="section-header">
            <div>
              <h2>Estimator Questions</h2>

              <p>
                Changes here automatically appear
                on the public estimator.
              </p>
            </div>
          </div>


          {config.questions.map(
            (question, questionIndex) => (
              <div
                className="question-editor"
                key={question.key}
              >

                <div className="question-editor-header">

                  <strong>
                    Question {questionIndex + 1}
                  </strong>

                  <span>
                    {question.key}
                  </span>

                </div>


                <div className="admin-grid">

                  <div className="field">
                    <label>Label</label>

                    <input
                      value={
                        question.label || ""
                      }
                      onChange={(event) =>
                        updateQuestion(
                          questionIndex,
                          "label",
                          event.target.value
                        )
                      }
                    />
                  </div>


                  <div className="field">
                    <label>Type</label>

                    <input
                      value={
                        question.type || ""
                      }
                      disabled
                    />
                  </div>

                </div>


                {question.options &&
                  question.options.length > 0 && (
                    <div className="options-editor">

                      <h3>Options</h3>

                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => (
                          <div
                            className="option-editor"
                            key={
                              option.value
                            }
                          >

                            <input
                              value={
                                option.label ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  "label",
                                  event.target
                                    .value
                                )
                              }
                              placeholder="Label"
                            />

                            <input
                              value={
                                option.value ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  "value",
                                  event.target
                                    .value
                                )
                              }
                              placeholder="Value"
                            />

                          </div>
                        )
                      )}

                    </div>
                  )}

              </div>
            )
          )}

        </section>


        {/* SAVE */}

        <div className="save-container">

          <button
            className="primary-button save-button"
            onClick={saveConfiguration}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Configuration"}
          </button>

        </div>


        {/* LEADS */}

        <section className="admin-section">

          <div className="section-header">

            <div>
              <h2>Leads</h2>

              <p>
                Submitted estimate requests
              </p>
            </div>

            <strong>
              {leads.length} Leads
            </strong>

          </div>


          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Estimate</th>
                  <th>Date</th>
                </tr>
              </thead>


              <tbody>

                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty-cell"
                    >
                      No leads yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id}>

                      <td>{lead.name}</td>

                      <td>{lead.phone}</td>

                      <td>{lead.email}</td>

                      <td>
                        $
                        {lead.estimate_low?.toLocaleString()}
                        {" - "}
                        $
                        {lead.estimate_high?.toLocaleString()}
                      </td>

                      <td>
                        {new Date(
                          lead.captured_at
                        ).toLocaleDateString()}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;