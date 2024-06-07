class CarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos para el componente del auto */
                .car {
                    width: 100%;
                    height: 100%;
                    background-color: red;
                    color: red;
                    text-align: center;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    position: relative;
                }

                .license {
                    position: absolute;
                    top: -28px;
                    background-color: rgba(255, 0, 0, 0.7);
                    padding: 2px 5px;
                    border-radius: 3px;
                    width: 73px;
                    height: 74px;
                    color: black;
                }
                .actions {
                    position: absolute;
                    top: 10.5px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .info {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #2196F3;
                    color: white;
                    padding: 3px 13px;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.3s;
                }

                .delete {
                    position: absolute;
                    top: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #2196F3;
                    color: white;
                    padding: 4px 5px;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.3s;
                }

                .info:hover,
                .delete:hover {
                    background-color: #0d47a1;
                    transform: translateX(-50%) translateY(-2px);
                }

                /* Estilos para la ventana emergente (modal) */
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0,0,0,0.4);
                    text-align: center;
                }
                .modal-content {
                    background-color: rgba(255, 255, 255, 0.9);
                    margin: 15% auto;
                    padding: 20px;
                    border-radius: 10px;
                    width: 80%;
                    max-width: 400px;
                    border: 2px solid #333;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                }
                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
                .modal-form {
                    margin-top: 20px;
                    text-align: left;
                }
                .modal-form label {
                    display: block;
                    margin-bottom: 5px;
                    color: #333;
                }
                .modal-form input[type="text"] {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                .modal-form button[type="button"] {
                    background-color: #f44336;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition-duration: 0.4s;
                    margin-right: 10px;
                }
                .modal-form button[type="button"]:hover {
                    background-color: #e53935;
                }
                .modal-form button[type="button"].save {
                    background-color: #4CAF50;
                }
                .modal-form button[type="button"].save:hover {
                    background-color: #45a049;
                }


            </style>

            <div class="car">
                <span class="license"></span>
                <span class="model"></span>
                <div class="actions">
                    <button class="delete">ELIMINAR</button>
                    <button class="info">INFO</button>
                </div>
            </div>

            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <form class="modal-form">
                        <label>
                            Modelo:
                            <input type="text" class="model-input">
                        </label>
                        <label>
                            Matrícula:
                            <input type="text" class="license-input">
                        </label>
                        <label>
                            Estado:
                            <input type="text" class="estado-input">
                        </label>
                        <label>
                            Tipo:
                            <input type="text" class="tipo-input">
                        </label>
                        <label>
                        Hora de Entrada:
                        <input type="text" class="hora-entrada-input" disabled>
                    </label>
                        <button type="button" class="save">Guardar</button>
                        <button type="button" class="delete-modal">Eliminar</button>
                    </form>
                </div>
            </div>
        `;

        this.actualizarComponente();

        // Asignar eventos a los botones del componente
        this.shadowRoot.querySelector('.info').addEventListener('click', this.showInfo.bind(this));
        this.shadowRoot.querySelector('.close').addEventListener('click', this.closeModal.bind(this));
        this.shadowRoot.querySelector('.save').addEventListener('click', this.saveChanges.bind(this));
        this.shadowRoot.querySelector('.delete-modal').addEventListener('click', this.deleteCar.bind(this));
        this.shadowRoot.querySelector('.delete').addEventListener('click', this.deleteCar.bind(this));
    }
    

    static get observedAttributes() {
        return ['model', 'license', 'row', 'col', 'estado', 'tipo', 'hora-entrada'];
    }

    attributeChangedCallback() {
        this.actualizarComponente();
    }

    actualizarComponente() {
        const model = this.getAttribute('model');
        const license = this.getAttribute('license');
        const row = this.getAttribute('row');
        const col = this.getAttribute('col');
        const estado = this.getAttribute('estado');
        const tipo = this.getAttribute('tipo');
        const horaEntrada = this.getAttribute('hora-entrada');
        // Actualizar el contenido y los estilos del componente


        const carDiv = this.shadowRoot.querySelector('.car');
        carDiv.querySelector('.license').textContent = license;
        carDiv.querySelector('.model').textContent = model;

        carDiv.style.gridRowStart = row;
        carDiv.style.gridColumnStart = col;

        // Actualizar los campos del modal
        const modal = this.shadowRoot.querySelector('.modal');
        modal.querySelector('.model-input').value = model || '';
        modal.querySelector('.license-input').value = license || '';
        modal.querySelector('.estado-input').value = estado || 'Activo';
        modal.querySelector('.tipo-input').value = tipo || '';
        modal.querySelector('.hora-entrada-input').value = horaEntrada || '';
    }

    showInfo() {
        const modal = this.shadowRoot.querySelector('.modal');
        modal.style.display = 'block';
    }

    closeModal() {
        const modal = this.shadowRoot.querySelector('.modal');
        modal.style.display = 'none';
    }
     // Guardar los cambios realizados en el modal
    saveChanges() {
        const modelInput = this.shadowRoot.querySelector('.model-input').value;
        const licenseInput = this.shadowRoot.querySelector('.license-input').value;
        const estadoInput = this.shadowRoot.querySelector('.estado-input').value;
        const tipoInput = this.shadowRoot.querySelector('.tipo-input').value;
        //const hora = this.shadowRoot.querySelector('.hora-entrada-input').value;

        // Actualizar los atributos del componente con los nuevos valores
        this.setAttribute('model', modelInput);
        this.setAttribute('license', licenseInput);
        this.setAttribute('estado', estadoInput);
        this.setAttribute('tipo', tipoInput);
        //this.setAttribute('hora-entrada', tipoInput);

         // Cerrar el modal y notificar que se han realizado cambios
        this.closeModal();
        this.dispatchEvent(new Event('carUpdated'));
    }
    



    // Eliminar el componente del DOM
    // deleteCar() {
    //     this.actualizarComponente();
    //     this.calculateTariff();
    //     this.dispatchEvent(new Event('carUpdated'));

    // }
    // Eliminar el componente del DOM
    deleteCar() {
        this.actualizarComponente();
        this.calculateTariff();
        this.dispatchEvent(new Event('carUpdated'));
        //this.dispatchEvent(new Event('carDeleted'));
        
        this.dispatchEvent(new Event('carDeleted', { bubbles: true, composed: true }));
        this.remove();
    }

    
    calculateTariff() {
        const horaEntrada = this.getAttribute('hora-entrada');
        const horaSalida = new Date();
        const entrada = new Date(horaEntrada);
        const salida = horaSalida;
        const tiempoEstacionadoEnMinutos = Math.floor((salida - entrada) / 1000 ); // en minutos
    
        const tarifaPorMinuto = 5; // Tarifa por segundo
        const totalAPagar = tarifaPorMinuto * tiempoEstacionadoEnMinutos;
    
        alert(`Hora de entrada: ${entrada.toLocaleString()}\nHora de salida: ${salida.toLocaleString()}\nEl total a pagar es Bs ${totalAPagar.toFixed(2)} por ${tiempoEstacionadoEnMinutos} minutos.`);
        this.remove();
    }
    
}

// Definir el nuevo elemento personalizado
customElements.define('car-component', CarComponent);
