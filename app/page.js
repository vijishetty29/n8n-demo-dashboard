"use client";

import { useEffect, useState } from 'react';
import './page.css';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workflowUrl, setWorkflowUrl] = useState(
    process.env.NEXT_PUBLIC_N8N_WORKFLOW_URL ||
      'https://vijishetty.app.n8n.cloud/assistant/c7843dbc-58ed-4b62-8a4c-92837b27adaa'
  );

  const loadRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error || 'Failed to load requests');
      }

      setRequests(payload.requests || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error || 'Failed to trigger workflow');
      }

      setMessage('');
      await loadRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="app-card">
        <header className="topbar">
          <div>
            <p className="eyebrow">n8n demo</p>
            <h1>Workflow Trigger Dashboard</h1>
          </div>
          <a className="workflow-link" href={workflowUrl} target="_blank" rel="noreferrer">
            Open n8n workflow
          </a>
        </header>

        <section className="panel">
          <h2>Trigger a workflow</h2>
          <form onSubmit={handleSubmit} className="trigger-form">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write something to send to the workflow"
            />
            <button type="submit" disabled={loading || !message.trim()}>
              {loading ? 'Sending...' : 'Trigger workflow'}
            </button>
          </form>

          {error ? <p className="error-message">{error}</p> : null}
        </section>

        <section className="panel">
          <div className="section-header">
            <h2>Recent requests</h2>
            <button type="button" className="secondary-button" onClick={loadRequests}>
              Refresh
            </button>
          </div>

          {requests.length === 0 ? (
            <p className="empty-state">No requests saved yet.</p>
          ) : (
            <div className="request-list">
              {requests.map((request) => (
                <article key={request.id} className="request-item">
                  <div className="request-meta">
                    <span className={`status status-${request.status || 'unknown'}`}>
                      {request.status || 'unknown'}
                    </span>
                    <time>{new Date(request.created_at).toLocaleString()}</time>
                  </div>

                  <p className="request-message">{request.message || 'No message'}</p>

                  <div className="request-details">
                    <div>
                      <strong>Workflow</strong>
                      <a href={request.workflow_url} target="_blank" rel="noreferrer">
                        View workflow
                      </a>
                    </div>
                    <div>
                      <strong>Payload</strong>
                      <pre>{JSON.stringify(request.request_payload, null, 2)}</pre>
                    </div>
                    <div>
                      <strong>Response</strong>
                      <pre>{JSON.stringify(request.response_data, null, 2)}</pre>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
