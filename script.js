document.addEventListener("DOMContentLoaded", () => {
    const csvFileInput = document.getElementById("csvFileInput");
    const uploadCSVButton = document.getElementById("uploadCSVButton");
    const startScanButton = document.getElementById("startScanButton");
    const cameraContainer = document.getElementById("cameraContainer");
    const cameraFeed = document.getElementById("cameraFeed");
    const outputDiv = document.getElementById("output");
    const acceptedOutputsDiv = document.getElementById("acceptedOutputs");
    const acceptedList = document.getElementById("acceptedList");

    let acceptedOutputs = [];

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

    // Event listener for clicking the "Start Scanning" button
    startScanButton.addEventListener("click", () => {
        initializeBarcodeScanner();
    });

    // Function to initialize QuaggaJS for barcode scanning
    function initializeBarcodeScanner() {
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
        });

        Quagga.onDetected((data) => {
            const studentNumber = data.codeResult.code;
            Quagga.stop();
            processStudentID(studentNumber);
        });
    }
});
