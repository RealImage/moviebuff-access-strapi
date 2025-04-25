import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const strapiEndpoint = `http://qa-moviebuff-audio.moviebuff.com/api/custom-list-csv`;
  const strapiEndpoint1 = `http://qa-moviebuff-audio.moviebuff.com/api/device-session-list-csv`;
  // const strapiEndpoint = `${process.env.STRAPI_API_URL}/api/custom-list-csv`;

  const exportTheatres = async () => {
    setMessage('Exporting theatres...');
    try {
      const response = await axios.get(strapiEndpoint, {
        headers: {
          Authorization: `Bearer cf1386d70814be4c13df79a943a937a4c85c6fc0408639429dfe165a775ee02ac082b4f36dabb7e25d48d14a7173d7722435a51b4871f497ff02d5209b34d9f1b7fea1e961ae20ced2a2e06eb70c6dc51374aea2cbb4ee6009fe8466888870a3b0ac3e42c0720fa21e2c684ea4ff7add5f8b7d8636610fd12e2a4d827bdd93ef`,
          // Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        responseType: 'blob', 
      });

      // Create a URL for the Blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const formattedDate = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '').replace(/\//g, '-').replace(/:/g, '-').replace(' ', '_');
    const filename = `Theatre-Export-${formattedDate}.csv`
      link.setAttribute('download', filename);  // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log('Theatres exported:', response.data);
      setMessage('Theatres exported successfully!');
    } catch (error) {
      console.error('Error exporting theatres:', error);
      setMessage(`Error exporting theatres. Please try again. ${error}`);
    }
  };

  const exportDeviceSessions = async () => {
    setMessage('Exporting Device sessions...');
    try {
      const response = await axios.get(strapiEndpoint1, {
        headers: {
          Authorization: `Bearer cf1386d70814be4c13df79a943a937a4c85c6fc0408639429dfe165a775ee02ac082b4f36dabb7e25d48d14a7173d7722435a51b4871f497ff02d5209b34d9f1b7fea1e961ae20ced2a2e06eb70c6dc51374aea2cbb4ee6009fe8466888870a3b0ac3e42c0720fa21e2c684ea4ff7add5f8b7d8636610fd12e2a4d827bdd93ef`,
          // Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        responseType: 'blob', 
      });

      // Create a URL for the Blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const formattedDate = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '').replace(/\//g, '-').replace(/:/g, '-').replace(' ', '_');
    const filename = `Device-Session-Export-${formattedDate}.csv`
      link.setAttribute('download', filename);  // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log('Device sessions exported:', response.data);
      setMessage('Device sessions exported successfully!');
    } catch (error) {
      console.error('Error exporting Device sessions:', error);
      setMessage(`Error exporting Device sessions. Please try again. ${error}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>
      <button style={styles.button} onClick={exportTheatres}>Export Theatres</button>
      <button style={styles.button} onClick={exportDeviceSessions}>Export Device Sessions</button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '0',
    padding: '0',
    backgroundColor: 'rgb(33, 33, 52)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  heading: {
    marginBottom: '20px',
    color: 'white',
  },
  message: {
    marginTop: 'revert',
    color: 'white',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Dashboard;
