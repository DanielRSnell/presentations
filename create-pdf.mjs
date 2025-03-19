#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const BASE_URL = 'http://localhost:4321';
const PRESENTATION_PATH = '/btcs';
const OUTPUT_DIR = path.join(__dirname, 'public', 'decks');
const OUTPUT_FILE = 'btcs.pdf';
const WAIT_TIME = 1000; // Time to wait for page to load in ms

// Helper function for timeout
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getSlideUrls() {
  console.log('Getting slide URLs...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Navigate to the first page of the presentation
    console.log(`Navigating to ${BASE_URL}${PRESENTATION_PATH}...`);
    await page.goto(`${BASE_URL}${PRESENTATION_PATH}`, { 
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    // Find all navigation links to determine the number of slides
    console.log('Finding slide links...');
    const slideUrls = await page.evaluate(() => {
      // Look for navigation links or slide indicators
      const links = Array.from(document.querySelectorAll('a[href^="/btcs/"]'));
      const urls = links.map(link => link.href);
      
      // Filter out duplicates and sort
      return [...new Set(urls)].sort((a, b) => {
        // Sort by page number
        const getPageNum = (url) => {
          const match = url.match(/page-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return getPageNum(a) - getPageNum(b);
      });
    });
    
    console.log(`Found ${slideUrls.length} slide URLs`);
    await browser.close();
    return slideUrls;
  } catch (error) {
    console.error('Error getting slide URLs:', error);
    await browser.close();
    throw error;
  }
}

async function generatePDF() {
  console.log('Starting PDF generation...');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`Output directory created: ${OUTPUT_DIR}`);
    
    // Get all slide URLs
    const slideUrls = await getSlideUrls();
    console.log(`Found ${slideUrls.length} slides to process`);
    
    if (slideUrls.length === 0) {
      throw new Error('No slides found. Make sure the Astro dev server is running at ' + BASE_URL);
    }
    
    // Launch browser for PDF generation
    console.log('Launching browser for PDF generation...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport size for presentation (16:9 aspect ratio)
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('Viewport set to 1920x1080');
    
    // Create PDF from all slides
    const pdfPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
    console.log(`PDF will be saved to: ${pdfPath}`);
    
    // Create a temporary directory for individual slide PDFs
    const tempDir = path.join(OUTPUT_DIR, 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    // Array to store paths to individual slide PDFs
    const pdfPaths = [];
    
    // Generate individual PDFs for each slide
    for (let i = 0; i < slideUrls.length; i++) {
      const url = slideUrls[i];
      console.log(`Processing (${i+1}/${slideUrls.length}): ${url}`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      // Wait for the page to be fully loaded
      await wait(WAIT_TIME); // Wait for animations to complete
      
      // Hide the navigation component
      await page.evaluate(() => {
        // Hide elements with component-url="/src/components/SlideNavigation.tsx"
        const navElements = document.querySelectorAll('[component-url="/src/components/SlideNavigation.tsx"]');
        navElements.forEach(el => {
          el.style.display = 'none';
        });
        
        // Also try to hide by class or ID if the component-url selector doesn't work
        const possibleNavSelectors = [
          '.slide-navigation', 
          '#slide-navigation',
          'nav',
          '.navigation',
          '[data-slide-nav]'
        ];
        
        possibleNavSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.style.display = 'none';
          });
        });
        
        // Return true if we found and hid any navigation elements
        return navElements.length > 0;
      });
      
      // Wait a bit more after hiding elements to ensure rendering is complete
      await wait(500);
      
      console.log(`Navigation elements hidden for slide ${i+1}`);
      
      // Generate PDF for this slide
      const slidePdfPath = path.join(tempDir, `slide-${i+1}.pdf`);
      await page.pdf({
        path: slidePdfPath,
        format: 'Letter',
        landscape: true,
        printBackground: true,
        margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
      });
      
      pdfPaths.push(slidePdfPath);
      console.log(`Saved slide ${i+1} to ${slidePdfPath}`);
    }
    
    // Close the browser
    await browser.close();
    
    // Merge PDFs using pdf-lib
    console.log('Merging PDFs...');
    const mergedPdf = await PDFDocument.create();
    
    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.readFile(pdfPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    
    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile(pdfPath, mergedPdfBytes);
    
    // Clean up temporary files
    console.log('Cleaning up temporary files...');
    for (const tempPdfPath of pdfPaths) {
      await fs.unlink(tempPdfPath);
    }
    await fs.rmdir(tempDir);
    
    console.log(`PDF successfully generated at: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

// Check if Astro server is running
async function checkServerRunning() {
  try {
    console.log(`Checking if server is running at ${BASE_URL}...`);
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set a longer timeout and add more logging
    console.log('Attempting to connect to server...');
    await page.goto(BASE_URL, { 
      timeout: 10000,
      waitUntil: 'networkidle2'
    });
    
    console.log('Successfully connected to server');
    await browser.close();
    return true;
  } catch (error) {
    console.error('Error connecting to server:', error.message);
    console.error('Error: Astro dev server is not running at ' + BASE_URL);
    console.log('Please start the server with: pnpm dev');
    return false;
  }
}

// Main execution
(async () => {
  if (await checkServerRunning()) {
    try {
      await generatePDF();
    } catch (error) {
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
})();
