import express from 'express';
import { fetchIPCA, fetchCDI, saveIndicator } from '../server/src/bcb-api';
import cors from 'cors';
import { Logger } from '../server/src/logger';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Updates IPCA and CDI indicators from BCB API
 */
app.post('/api/update-indicators', async (req, res) => {
  await Logger.info('Manual update of indicators requested');
  try {
    // Fetch IPCA data
    const ipcaData = await fetchIPCA();
    await saveIndicator(ipcaData, 'ipca');
    await Logger.info('IPCA updated successfully', { data: ipcaData });

    // Fetch CDI data
    const cdiData = await fetchCDI();
    await saveIndicator(cdiData, 'cdi');
    await Logger.info('CDI updated successfully', { data: cdiData });

    res.json({
      success: true,
      message: 'Indicators updated successfully',
      data: {
        ipca: ipcaData,
        cdi: cdiData,
      },
    });
  } catch (error) {
    await Logger.error('Failed to update indicators', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update indicators',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Serve static files from the Vite build output
app.use(express.static(path.join(process.cwd(), 'dist')));

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Vercel serverless function handler
export default app; 