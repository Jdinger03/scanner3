const barcodeScanner = new BarcodeScanner({
  videoElement: document.getElementById('barcode-scanner'),
});

barcodeScanner.on('barcodeDetected', (barcode) => {
  document.getElementById('barcode-data').innerHTML = barcode.data;
});
