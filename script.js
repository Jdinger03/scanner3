document.addEventListener("DOMContentLoaded", () => {
    const csvFileInput = document.getElementById("csvFileInput");
    const uploadCSVButton = document.getElementById("uploadCSVButton");
    const startScanButton = document.getElementById("startScanButton");
    const cameraContainer = document.getElementById("cameraContainer");
    const cameraFeed = document.getElementById("cameraFeed");
    const outputDiv = document.getElementById("output");
    const acceptedOutputsDiv = document.getElementById("acceptedOutputs");
    const acceptedList = document.getElementById("acceptedList");
    const canvas = document.getElementById("canvas");
    const popup = document.getElementById("popup");
    const popupClose = document.getElementById("popupClose");
    const popupMessage = document.getElementById("popupMessage");

    let acceptedOutputs = [];
    let scannerStarted = false;

    // Event listener for clicking the "Upload CSV File" button
    uploadCSVButton.addEventListener("click", () => {
        csvFileInput.click();
    });

    // Event listener for file input change
    csvFileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            parseCSVFile(file);
        }
    });

    // Function to parse the uploaded CSV file
    function parseCSVFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const contents = event.target.result;
            acceptedOutputs = contents.split("\n").map((line) => line.trim());
            displayAcceptedOutputs();
        };
        reader.readAsText(file);
    }

    // Function to display the accepted outputs
    function displayAcceptedOutputs() {
        if (acceptedOutputs.length > 0) {
            acceptedList.innerHTML = acceptedOutputs.map((output) => `<li>${output}</li>`).join("");
            acceptedOutputsDiv.style.display = "block";
            startScanButton.removeAttribute("disabled");
        } else {
            acceptedOutputsDiv.style.display = "none";
        }
    }

    // Function to show a popup with a message
    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = "block";
    }

    // Event listener for closing the popup
    popupClose.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // Function to initialize QuaggaJS for barcode scanning
    function initializeBarcodeScanner() {
        if (!scannerStarted) {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: cameraFeed,
                    constraints: {
                        facingMode: "environment",
                    },
                },
                decoder: {
                    readers: ["code_39_reader"],
                },
            }, function(err) {
                if (err) {
                    console.error("Error initializing QuaggaJS:", err);
                    return;
                }
                Quagga.start();
                scannerStarted = true;
            });

            Quagga.onDetected((data) => {
                const barcode = data.codeResult.code;
                processBarcode(barcode);
            });
        }
    }

    // Event listener for clicking the "Start Scanning" button
    startScanButton.addEventListener("click", () => {
        initializeBarcodeScanner();
    });

    // Function to process the scanned barcode
    function processBarcode(barcode) {
        if (acceptedOutputs.includes(barcode)) {
            showPopup(`Barcode ${barcode} is Accepted`);
        } else {
            showPopup(`Barcode ${barcode} is Not Accepted`);
        }

        // Stop the scanner after processing
        Quagga.stop();
        scannerStarted = false;
    }
});
