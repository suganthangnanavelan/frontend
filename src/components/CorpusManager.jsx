import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const CorpusManager = () => {
  const [intents, setIntents] = useState([]);
  const [intent, setIntent] = useState('');
  const [utterances, setUtterances] = useState('');
  const [responses, setResponses] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    const result = await axios.get('http://localhost:5000/intents');
    setIntents(result.data);
  };

  const addOrUpdateIntent = async () => {
    const newIntent = {
      intent,
      utterances: utterances.split(',').map((item) => item.trim()),
      responses: responses.split(',').map((item) => item.trim()),
    };

    if (editingId) {
      await axios.put(`http://localhost:5000/intents/${editingId}`, newIntent);
    } else {
      await axios.post('http://localhost:5000/intents', newIntent);
    }

    setIntent('');
    setUtterances('');
    setResponses('');
    setEditingId(null);
    fetchIntents();
  };

  const deleteIntent = async (id) => {
    await axios.delete(`http://localhost:5000/intents/${id}`);
    fetchIntents();
  };

  const startEditing = (intent) => {
    setIntent(intent.intent);
    setUtterances(intent.utterances.join(', '));
    setResponses(intent.responses.join(', '));
    setEditingId(intent._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 className="heading">Manage Intents</h1>
      <div>
        <input
          type="text"
          value={intent}
          placeholder="Intent Name"
          onChange={(e) => setIntent(e.target.value)}
        />
        <textarea
          value={utterances}
          placeholder="Utterances (comma separated)"
          onChange={(e) => setUtterances(e.target.value)}
        />
        <textarea
          value={responses}
          placeholder="Responses (comma separated)"
          onChange={(e) => setResponses(e.target.value)}
        />
        <button className="add-btn" onClick={addOrUpdateIntent}>
          {editingId ? 'Update Intent' : 'Add Intent'}
        </button>
      </div>
      <h2>Intents List</h2>
      <ul>
        {intents.map((intent) => (
          <li key={intent._id}>
            <strong>{intent.intent}</strong>
            <p>Utterances: {intent.utterances.join(', ')}</p>
            <p>Responses: {intent.responses.join(', ')}</p>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => startEditing(intent)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => deleteIntent(intent._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CorpusManager;