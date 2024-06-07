document.addEventListener('DOMContentLoaded', () => {
    const parkingMap = document.getElementById('parking-map');
    const rows = 8;
    const cols = 12;
    let vehicleCount = 0;

    function actualizarContador() {
        document.getElementById('vehicle-count').innerText = vehicleCount;
    }

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i + 1;

        const row = Math.floor(i / cols);
        const col = i % cols;

        if (
            (row >= 1 && row <= 7 && (col == 1 || col == 10)) ||
            (col >= 2 && col <= 9 && (row == 1 || row == 6)) ||
            (row == 3 || row == 4) && (col >= 3 && col <= 8)
        ) {
            cell.classList.add('pasillo');
        } else {
            const cellNumber = document.createElement('span');
            cellNumber.className = 'cell-number';
            cellNumber.textContent = i + 1;
            cell.appendChild(cellNumber);
        }

        parkingMap.appendChild(cell);
    }

    loadCarsFromLocalStorage();

    document.getElementById('eliminarAutos').addEventListener('click', () => {
        document.querySelectorAll('car-component').forEach(car => {
            car.remove();
        });
        document.querySelectorAll('.grid-cell').forEach(cell => {
            if (!cell.classList.contains('pasillo')) {
                cell.style.backgroundColor = 'rgb(93, 230, 93)';
            }
        });
        localStorage.removeItem('cars');
        vehicleCount = 0;
        actualizarContador();
    });

    document.getElementById('car-form').onsubmit = (e) => {
        e.preventDefault();

        const model = document.getElementById('car-model').value.trim();
        const license = document.getElementById('car-license').value.trim();
        const tipo = document.getElementById('car-tipo').value.trim();
        const cellNumber = parseInt(document.getElementById('cell-number').value);

        if (!model || !license || !tipo || isNaN(cellNumber)) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const targetCell = document.querySelector(`.grid-cell[data-index='${cellNumber}']`);
        if (!targetCell || targetCell.classList.contains('pasillo') || targetCell.querySelector('car-component')) {
            alert('La casilla seleccionada no es válida o está ocupada.');
            return;
        }

        addCarToCell(targetCell, model, license, tipo);
        cerrarVentana();
    };

    function addCarToCell(cell, model, license, tipo, horaEntrada = null) {
        const carComponent = document.createElement('car-component');
        carComponent.setAttribute('model', model);
        carComponent.setAttribute('license', license);
        carComponent.setAttribute('tipo', tipo);
        carComponent.setAttribute('row', Math.ceil((cell.dataset.index - 1) / cols) + 1);
        carComponent.setAttribute('col', (cell.dataset.index - 1) % cols + 1);
        carComponent.setAttribute('hora-entrada', horaEntrada || new Date().toLocaleString());
        cell.appendChild(carComponent);

        carComponent.addEventListener('carDeleted', () => {
            vehicleCount--;
            actualizarContador();
            saveCarsToLocalStorage();
        });

        vehicleCount++;
        actualizarContador();
        saveCarsToLocalStorage();
    }

    function cerrarVentana() {
        document.getElementById('miVentana').style.display = 'none';
    }

    window.abrirVentana = function() {
        document.getElementById('miVentana').style.display = 'block';
    };

    function saveCarsToLocalStorage() {
        const cars = [];
        document.querySelectorAll('car-component').forEach(car => {
            cars.push({
                model: car.getAttribute('model'),
                license: car.getAttribute('license'),
                row: car.getAttribute('row'),
                col: car.getAttribute('col'),
                tipo: car.getAttribute('tipo'),
                horaEntrada: car.getAttribute('hora-entrada')
            });
        });
        localStorage.setItem('cars', JSON.stringify(cars));
    }

    function loadCarsFromLocalStorage() {
        const cars = JSON.parse(localStorage.getItem('cars')) || [];
        vehicleCount = cars.length;
        actualizarContador();
        cars.forEach(carData => {
            const cellIndex = (carData.row - 1) * cols + carData.col - 1;
            const cell = document.querySelector(`.grid-cell[data-index='${cellIndex + 1}']`);
            if (cell) {
                addCarToCell(cell, carData.model, carData.license, carData.tipo, carData.horaEntrada);
            } else {
                console.error(`Celda no encontrada para el índice: ${cellIndex + 1}`);
            }
        });
    }

    document.addEventListener('carUpdated', saveCarsToLocalStorage);
});
